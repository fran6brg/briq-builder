import { SetData } from '../../../builder/SetData';
import { ADDRESSES } from '@/chain/Contracts';
import { LegacySetContract } from '../../../chain/contracts/set';
import getBaseUrl, { fetchData } from '../../../url';

class LegacySetsMgr
{
    oldSets = [] as string[];
    oldSetsData = {} as { [sid: string]: SetData };
    oldSetsImg = {} as { [sid: string]: string };

    ignoredSets = [] as string[];

    legacyContract!: LegacySetContract;
    
    constructor()
    {
        this.ignoredSets = (() => {
            try {
                return JSON.parse(window.localStorage.getItem("legacy_sets_ignored")) || [];
            } catch(_) { return []; }
        })();
    }

    ignoreSet(sid: string)
    {
        let idx = this.ignoredSets.indexOf(sid);
        if (idx === -1)
        {
            this.ignoredSets.push(sid);
            window.localStorage.setItem("legacy_sets_ignored", JSON.stringify(this.ignoredSets));
        }
    }

    resetIgnoredSets()
    {
        this.ignoredSets = [];
        window.localStorage.setItem("legacy_sets_ignored", JSON.stringify(this.ignoredSets));
    }

    getSetsToMaybeMigrate()
    {
        let ret = [] as string[];
        for (let sid of this.oldSets)
            if (this.ignoredSets.indexOf(sid) === -1)
                ret.push(sid);
        return ret;
    }

    async setup(store: any)
    {
        this.legacyContract = new LegacySetContract(ADDRESSES['starknet-testnet-legacy'].set, store.signer);
        let sets = await this.legacyContract.balanceDetailsOf(store.userWalletAddress);
        for (let set of sets)
            this.oldSets.push(set);
        logDebug("LEGACY SETS - ", sets);
        let fetchSetData = async (sid: string) => {
            let data = (await fetchData("store_get/" + sid)).data;
            return new SetData(sid).deserialize(data);
        };
        this.oldSets.forEach(async (sid: string) => {
            try {
                let set = await fetchSetData(sid);
                this.oldSetsData[sid] = set;
            } catch(_) {}
        });
        this.oldSets.forEach(async (sid: string) => {
            let src = new Image();
            src.crossOrigin = "anonymous";
            src.src = getBaseUrl() + "/preview/" + sid;
            try {
                await src.decode();
                this.oldSetsImg[sid] = src;
            } catch (_) {}
        });
    }
}

import { reactive } from 'vue';
import { logDebug } from '../../../Messages';
export const legacySetsMgr = reactive(new LegacySetsMgr());
