<script setup lang="ts">
import Button from '../generic/Button.vue';
import InputComp from './InputComp.vue'
import { builderInputFsm } from '@/builder/inputs/BuilderInput';
import Tooltip from '../generic/Tooltip.vue';
import { pushModal } from '../Modals.vue';
import BriqBrowserVue from './modals/BriqBrowser.vue';
</script>

<template>
    <div id="sideBar" class="flex flex-nowrap flex-col mx-4 md:py-20 py-12 absolute left-0 top-0 max-w-full max-h-screen justify-top pointer-events-none">
        <div v-if="!inputStore.forceInput && editMode" class="my-2 md:my-4 md:grid md:grid-rows-2 md:grid-cols-2 flex flex-row gap-1 w-24 pointer-events-auto">
            <Btn tooltip="In 'Place' mode, left-click to place briqs, right-click to delete, hold SHIFT to place multiple briqs."
                @click="builderInputFsm.switchTo('place')" :disabled="isPlacing"><i class="fas fa-cube"/></Btn>
            <Btn tooltip="In 'Paint' mode, left-click to repaint briqs, right-click to sample the briq color, hold SHIFT to paint multiple briqs."
                @click="builderInputFsm.switchTo('paint')" :disabled="isPainting"><i class="fas fa-paint-brush"/></Btn>
            <Btn tooltip="In 'Erase' mode, left-click to delete briqs, hold SHIFT to delete multiple briqs."
                @click="builderInputFsm.switchTo('erase')" :disabled="isErasing"><i class="far fa-trash-alt"/></Btn>
            <Btn tooltip="'Select' mode can be used to move or inspect briqs. Left-click to select, right-click to unselect."
                @click="builderInputFsm.switchTo('inspect')" :disabled="isInspecting"><i class="fas fa-mouse-pointer"></i></Btn>
            <Btn v-if="featureFlags.multiMaterials" class="flex-1 w-full col-span-2" tooltip="Browse the different materials of briqs you own and select which one to place"
                @click="openBriqBrowser">briq browser</Btn>
        </div>
        <div id="inputComp" class="flex md:flex-col max-w-full overflow-auto flex-row justify-stretch align-stretch content-stretch pointer-events-auto">
            <InputComp/>
        </div>
        <!-- Repeated 3 times for contrast -->
        <div v-if="editMode" position="relative w-full">
            <p class="absolute md:text-center md:w-full text-sm font-normal drop-shadow-md pointer-events-none select-none mix-blend-saturation whitespace-pre-line">{{ getNbBriqs }}</p>
            <p class="absolute md:text-center md:w-full text-sm font-normal drop-shadow-md pointer-events-none select-none mix-blend-difference whitespace-pre-line">{{ getNbBriqs }}</p>
            <Tooltip tooltip="This gives you the # of briqs used in the set, out of the total available briqs.">
                <p class="absolute md:text-center md:w-full text-sm font-normal drop-shadow-md pointer-events-auto select-none mix-blend-overlay whitespace-pre-line">
                {{ getNbBriqs }}</p></Tooltip>
        </div>
    </div>
</template>

<script lang="ts">
import { inputStore } from '../../builder/inputs/InputStore';
import { setsManager } from '../../builder/SetsManager';

import { defineComponent } from "vue";
export default defineComponent({
    data() {
        return {
        };
    },
    inject: ["chainBriqs", "featureFlags"],
    computed: {
        inputStore() {
            return inputStore;
        },
        builderInputFsm() {
            return builderInputFsm;
        },
        editMode() {
            return !inputStore.forceInput && setsManager.getInfo(this.$store.state.builderData.currentSet.id)?.status !== 'ONCHAIN_LOADED';
        },
        getNbBriqs() {
            let ret;
            // Vue reactiveness, this is opt-in for performance.
            this.$store.state.builderData.currentSet.usedByMaterial_;
            let used = 0;
            for (let mat in this.$store.state.builderData.currentSet.usedByMaterial)
                used += this.$store.state.builderData.currentSet.usedByMaterial[mat];
            if (this.chainBriqs.status === 'ERROR')
                return `${used} briqs\nError loading chain briqs`;
            if (this.chainBriqs.status === 'NOT_LOADED')
                return `${used} briqs\nLoading chain briqs...`;
            let total = this.chainBriqs.getNbBriqs();
            return `${used}/${total} briqs`;
        },
        isPlacing() {
            return inputStore.currentInput.indexOf('place') !== -1
        },
        isPainting() {
            return inputStore.currentInput.indexOf('paint') !== -1
        },
        isErasing() {
            return inputStore.currentInput.indexOf('erase') !== -1
        },
        isInspecting() {
            return ["inspect", "inspect_va", "inspect_box", "drag", "rotate", "copy_paste"].indexOf(inputStore.currentInput) !== -1;
        }
    },
    methods: {
        async openBriqBrowser() {
            await pushModal(BriqBrowserVue, {});
        }
    }
})
</script>

<style scoped>
</style>
