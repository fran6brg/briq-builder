<script setup lang="ts">
import Settings from '../builder/modals/Settings.vue';
import TransactionsMin from './TransactionsMin.vue';
import BriqDetails from './BriqDetails.vue';
import BlockchainStatus from './BlockchainStatus.vue';
</script>

<template>
    <!-- Below medium size, push the buttons down to leave room for minting stuff. -->
    <div v-if="!forceInput" class="absolute right-0 top-0 px-4 py-[6.5rem] md:py-4 max-h-screen flex flex-col lg:flex-row lg:items-start items-end gap-2 pointer-events-none">
        <BlockchainStatus class="max-h-screen"/>
        <div :class="'w-32 max-h-screen overflow-auto flex flex-nowrap flex-col justify-start content-end' + (expanded ? ' expanded' : ' unexpanded')">
            <Btn class="pointer-events-auto" tooltip="Access local set operations, settings, etc." @click="expanded = !expanded"><i class="mx-1 fas fa-bars"></i><span class="mx-1">Menu</span></Btn>
            <div class="my-2">
                <div class="flex flex-col flex-nowrap gap-1">
                    <Btn @click="pushModal(Settings, { background: 'rgba(0, 0, 0, 0.1)', align: 'justify-end items-start' })">Settings</Btn>
                    <Btn @click="$router.push({ path: '/legal' })">Legal / Privacy</Btn>
                    <a  v-if="CONF.theme === 'realms'" href="https://briq.construction"><Btn class="w-full"><span class="briq-logo">briq</span> home</Btn></a>
                    <Btn v-else="" @click="$router.push({ path: '/' })">Home</Btn>
                    <!--<Btn @click="$router.push({ path: '/admin' })">Admin</Btn>-->
                </div>
                <div class="flex flex-col content-end my-4">
                    <h4 class="text-center font-bold twshadow">LOCAL SETS</h4>
                    <Btn v-for="wipset in wipSets"
                        class="my-1 h-auto break-all"
                        @click="selectSet(wipset.id)"
                        :disabled="set.id == wipset.id"
                        :tooltip="(set.id == wipset.id) ? 'Set ' + set.id + ' is active.' : 'Click to switch to set ' + (wipset.name || wipset.id)"
                        >{{ wipset.name || wipset.id }} <i v-if="isViewOnly(wipset.id)" class="fas fa-cloud"></i></Btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { pushModal } from '../Modals.vue';

import { transactionsManager } from '../../builder/Transactions';
import { setsManager } from '../../builder/SetsManager';

import { inputStore } from '../../builder/inputs/InputStore';

import WalletSelectorVue from '../WalletSelector.vue';

import { CONF } from '@/Conf';
import { walletStore2 } from '@/chain/Wallet';

import { defineComponent, toRef, ref } from "vue";
export default defineComponent({
    data() {
        return {
            expanded: false,
            expandedCW: false,
            set: toRef(this.$store.state.builderData, "currentSet"),
            transactionsManager
        };
    },
    inject: ["messages"],
    computed: {
        CONF() {
            return CONF;
        },
        wallet() {
            return walletStore2;
        },
        forceInput() {
            return inputStore.forceInput;
        },
        isConnected() {
            return this.wallet.userWalletAddress;
        },
        wipSets() {
            return setsManager.setList.map(x => setsManager.setsInfo?.[x]?.local).filter(x => x);
        }
    },
    methods: {
        pushModal,
        isViewOnly(sid: string) {
            return setsManager.getInfo(sid).status !== 'LOCAL';
        },

        CWTitle() {
            if (this.isConnected)
                return this.wallet.userWalletAddress.substr(0, 5) + '...' + this.wallet.userWalletAddress.substr(-5, 5);
            return "Connect Wallet";
        },
        CWNet() {
            if (!this.isConnected)
                return '';
            return this.wallet.signer.baseUrl.search("mainnet") !== -1 ? 'mainnet' : 'testnet';
        },
        CWClick() {
            if (this.isConnected)
                this.expandedCW = ! this.expandedCW;
            else
                pushModal(WalletSelectorVue);
        },

        titleText: function() {
            let ret = "Briq";
            if (this.isConnected)
                ret += ': ' + this.wallet.userWalletAddress.substr(0, 5) + '...' + this.wallet.userWalletAddress.substr(-5, 5);
            return ret;
        },

        newSet: function() {
            this.$store.dispatch("builderData/create_wip_set");
        },
        copySet: function() {
            let data = this.set.serialize();
            delete data.id;
            this.$store.dispatch("builderData/create_wip_set", data);
        },
        async importSet() {
            let fileHandles = await window.showOpenFilePicker();
            for (let fileHandle of fileHandles)
            {
                try
                {
                    let file = await fileHandle.getFile();
                    let contents = JSON.parse(await file.text());
                    this.$store.dispatch("builderData/create_wip_set", contents);
                }
                catch(err) {
                    this.messages.pushMessage("Error while loading file " + fileHandle.name + " - check console for details");
                    console.log(err);
                }
            }
        },
        deleteSet: function() {
            this.$store.dispatch("builderData/delete_wip_set", this.set.id);
        },
        selectSet: function(setId: number) {
            this.$store.dispatch("builderData/select_set", setId);
        },
    }
})
</script>

<style scoped>

.tshadow {
    text-shadow: 0 0 2px rgb(0, 0, 0, 0.3);
}

.expanded {
    overflow: auto;
    /*@apply bg-black bg-opacity-40 rounded-md md:bg-transparent;*/
    @apply pointer-events-auto;
}
.unexpanded {
    overflow: hidden;
}
.expanded > div {
    @apply visible block;
}
.unexpanded > div {
    @apply invisible;
}
</style>
