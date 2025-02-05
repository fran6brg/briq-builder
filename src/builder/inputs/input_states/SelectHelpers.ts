import { MouseInputState } from './BuilderInputState';
import { selectionRender } from '../Selection';
import { THREE, SelectionBox as ThreeSelectionBox } from '@/three';
import getPreviewCube from '@/builder/graphics/PreviewCube';

import { store } from '@/store/Store'
import { camera } from '@/builder/graphics/Builder';
import type { HotkeyHandle } from '@/Hotkeys';
import type { Briq } from '@/builder/Briq';

export class BoxSelection extends MouseInputState
{
    startX!: number;
    startY!: number;

    switchBackTo!: string;
    cancelHotkey!: HotkeyHandle;

    onEnter(data: any) {
        this.switchBackTo = data.switchBackTo;

        this.curX = data.x;
        this.curY = data.y;
        this.startX = data.x;
        this.startY = data.y;

        this.fsm.gui.curX = this.curX;
        this.fsm.gui.curY = this.curY;
        this.fsm.gui.startX = this.startX;
        this.fsm.gui.startY = this.startY;

        this.fsm.gui.selectionBox = true;
    
        this.fsm.orbitControls.enabled = false;

        this.fsm.store.grabFocus = true;

        selectionRender.show();
        this.cancelHotkey = this.fsm.hotkeyMgr.subscribe("escape", () => { this.fsm.switchTo(this.switchBackTo); })
    }

    onExit() {
        this.fsm.hotkeyMgr.unsubscribe(this.cancelHotkey);
        selectionRender.hide();
        this.fsm.store.grabFocus = false;
        this.fsm.orbitControls.enabled = true;
        this.fsm.gui.selectionBox = false;
    }

    async onPointerMove(event: PointerEvent)
    {
        this.fsm.gui.curX = this.curX;
        this.fsm.gui.curY = this.curY;
    }

    async onPointerUp(event: PointerEvent)
    {
        if (this.startX === this.curX && this.startY === this.curY)
        {
            const pos = this.getIntersectionPos(this.curX, this.curY, true);
            this.fsm.store.selectionMgr.add(...pos);
            this.fsm.switchTo(this.switchBackTo);
            return;
        }
        try
        {
            let startX = (this.startX / window.innerWidth - 0.5) * 2;
            let curX = (this.curX / window.innerWidth - 0.5) * 2;
            let startY = -(this.startY / window.innerHeight - 0.5) * 2;
            let curY = -(this.curY / window.innerHeight - 0.5) * 2;
            if (startX === curX)
                curX += 0.0001;
            if (startY === curY)
                curY += 0.0001;
            // Hack around the threeselectionbox code to reuse the frustum construction code.
            let fakeScene = {
                children: []
            };
            let box = new ThreeSelectionBox(camera,  fakeScene, 10000);
            let frustum: THREE.Frustum;
            box.searchChildInFrustum = (ft) => frustum = ft;
            box.select(
                new THREE.Vector3(startX, startY, 0),
                new THREE.Vector3(curX, curY, 0)
            )
            let ret = [] as Briq[];
            let cpos1 = new THREE.Vector3();
            let cpos2 = new THREE.Vector3();
            let cbox = new THREE.Box3(cpos1, cpos2);
            store.state.builderData.currentSet.forEach((briq, pos) => {
                cpos1.x = pos[0];
                cpos1.y = pos[1];
                cpos1.z = pos[2];
                cpos2.x = pos[0] + 1;
                cpos2.y = pos[1] + 1;
                cpos2.z = pos[2] + 1;
                if (frustum.intersectsBox(cbox))
                    ret.push(briq);
            });
            await this.doAction(ret);
        } finally {
            this.fsm.switchTo(this.switchBackTo);
        }
    }

    // Override me
    async doAction(briqs: Briq[]) {}
}

export class VoxelAlignedSelection extends MouseInputState
{
    initialClickPos!: [number, number, number];
    currentClickPos!: [number, number, number] | undefined;
    switchBackTo!: string;
    cancelHotkey!: HotkeyHandle;

    extruding = false; // Whether to get the intersection pos or extrude by a briq.
    shouldClampToBounds = true;

    onEnter(data: any) {
        this.curX = data.x;
        this.curY = data.y;

        this.initialClickPos = this.getIntersectionPos(this.curX, this.curY, !this.extruding)!;
        if (this.initialClickPos)
        {
            if (this.initialClickPos[1] < 0)
            this.initialClickPos[1] = 0;

            if (this.shouldClampToBounds)
                this.initialClickPos = this.clampToBounds(...this.initialClickPos);
        }

        this.currentClickPos = this.initialClickPos;
        this.updatePreviewCube();

        this.fsm.orbitControls.enabled = false;
        this.fsm.store.grabFocus = true;
        this.cancelHotkey = this.fsm.hotkeyMgr.subscribe("escape", () => { this.fsm.switchTo(this.switchBackTo); })
    }

    onExit() {
        this.fsm.hotkeyMgr.unsubscribe(this.cancelHotkey);
        getPreviewCube().visible = false;
        this.fsm.store.grabFocus = false;
        this.fsm.orbitControls.enabled = true;
    }

    updatePreviewCube()
    {
        if (!this.currentClickPos)
        {
            getPreviewCube().visible = false;
            return;
        }
        getPreviewCube().visible = true;
        getPreviewCube().scale.set(Math.abs(this.initialClickPos[0] - this.currentClickPos[0]) + 1.1, Math.abs(this.initialClickPos[1] - this.currentClickPos[1]) + 1.1, Math.abs(this.initialClickPos[2] - this.currentClickPos[2]) + 1.1);
        getPreviewCube().position.set(
            ((this.initialClickPos[0] + this.currentClickPos[0]) / 2) + 0.5,
            ((this.initialClickPos[1] + this.currentClickPos[1]) / 2) + 0.5,
            ((this.initialClickPos[2] + this.currentClickPos[2]) / 2) + 0.5,
        );
    }

    async onPointerMove(event: PointerEvent)
    {
        this.currentClickPos = this.getIntersectionPos(this.curX, this.curY, !this.extruding);
        if (!this.currentClickPos)
            return;

        if (this.shouldClampToBounds)
            this.currentClickPos = this.clampToBounds(...this.currentClickPos);

        if (!this.initialClickPos)
        {
            this.initialClickPos = this.currentClickPos;
            if (this.initialClickPos[1] < 0)
                this.initialClickPos[1] = 0;
        }

        // Make it so that selecting floor-squares does something.
        if (!this.shouldClampToBounds && this.initialClickPos[1] === 0 && this.currentClickPos[1] === -1)
            this.currentClickPos[1] = 0;

        this.updatePreviewCube();
    }

    async onPointerUp(event: PointerEvent)
    {
        try
        {
            this.currentClickPos = this.getIntersectionPos(this.curX, this.curY, !this.extruding);
            if (!this.currentClickPos)
                return;
            if (this.shouldClampToBounds)
                this.currentClickPos = this.clampToBounds(...this.currentClickPos);
    
            // Make it so that selecting floor-squares does something.
            if (!this.shouldClampToBounds && this.initialClickPos[1] === 0 && this.currentClickPos[1] === -1)
                this.currentClickPos[1] = 0;
            await this.doAction(this.currentClickPos);
        } finally {
            this.fsm.switchTo(this.switchBackTo);
        }
    }

    // Override me
    async doAction(pos: [number, number, number]) {}
}
