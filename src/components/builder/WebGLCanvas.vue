<template>
    <div class="w-full h-screen block p-0 m-0">
        <canvas class="w-full h-full" id="backgroundgl" ref="canvas" v-on:pointermove="onPointerMove" v-on:pointerdown="onPointerDown"  v-on:pointerup="onPointerUp">
        </canvas>
        <div :class="'fixed top-0 left-0 h-screen w-screen' + (fsmGrabsFocus ? '' : ' hidden')" style="z-index: 10000;"
        v-on:pointermove="onPointerMove" v-on:pointerdown="onPointerDown"  v-on:pointerup="onPointerUp"
        >
        </div>
    </div>
</template>

<script lang="ts">
import { main, orbitControls, render } from "../../builder/graphics/Builder"

import { builderInputFsm } from "../../builder/inputs/BuilderInput"
import { inputStore } from '../../builder/inputs/InputStore'

import { defineComponent, toRef } from 'vue';
import { logDebug } from "../../Messages";
export default defineComponent({
    inject: ["hotkeyMgr"],
    data() {
        return {
            setup: false,
        }
    },
    async mounted() {
        await main(this.$refs.canvas);
        builderInputFsm.initialize(this.$refs.canvas as HTMLCanvasElement, orbitControls.controls, inputStore, this.hotkeyMgr);
        this.setup = true;
        this.frame();
    },
    computed: {
        fsmGrabsFocus() {
            return inputStore.grabFocus;
        }
    },
    methods: {
        frame() {
            render();
            builderInputFsm.onFrame();
            requestAnimationFrame(() => this.frame());
        },
        onPointerMove: async function(event) {
            await builderInputFsm.onPointerMove(event);
        },
        onPointerDown: async function(event) {
            await builderInputFsm.onPointerDown(event);
        },
        onPointerUp: async function(event) {
            await builderInputFsm.onPointerUp(event);
        }
    },
});
</script>
