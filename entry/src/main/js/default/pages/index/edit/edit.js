import router from '@system.router';
const SAVE_RECORD = 101;
const ACTION_SYNC = 0;
const ABILITY_TYPE_INTERNAL = 1;

export default {
    data: {
        isRestore: false,
        titleStr: 'default title',
        titleContent: 'default content',
        tag: "editpage",
        continueAbilityData: {
            titleStr: 'default title',
            titleContent: 'default content',
        }
    },
    onInit() {
        console.info("onInit " + this.tag);
    },
    onReady() {
        console.info("onReady " + this.tag);
    },
    onShow() {
        console.info("onShow " + this.tag);
    },
    onHide() {
        console.info("onHide " + this.tag);
    },
    onChange(e) {
        if (!this.isRestore) {
            this.titleContent = e.text;
        }
        this.isRestore = false;
    },
    async migrate() {
        console.info("click migrate ");
        //
        var result = await FeatureAbility.continueAbility();
        console.info("result:" + JSON.stringify(result));
    },
    async saveRecords(keyString, valueString) {
        console.info("save Note " + keyString + valueString);
        var record = {
            "key": keyString,
            "value": valueString
        };
        var actionData = JSON.stringify(record);
        var action = {};
        action.bundleName = 'com.ohos.demo.uitest';
        action.abilityName = 'com.ohos.demo.uitest.ComputeInternalAbility';
        action.messageCode = SAVE_RECORD;
        action.data = actionData;
        action.abilityType = ABILITY_TYPE_INTERNAL;
        action.syncOption = ACTION_SYNC;
        var result = await FeatureAbility.callAbility(action);
        var ret = JSON.parse(result);
        if (ret.code == 0) {
            console.info('saveRecords result is:' + JSON.stringify(ret.abilityResult));
        } else {
            console.info('saveRecords error code:' + JSON.stringify(ret.code));
        }
        router.push({
            uri: 'pages/index/index',
            params: {
            },
        });
    },
    onStartContinuation: function () {
        // 判断当前的状态是不是适合迁移
        console.info("onStartContinuation");
        return true;
    },
    onCompleteContinuation: function (code) {
        // 迁移操作完成，code返回结果
        console.info("nCompleteContinuation: code = " + code);
    },
    onSaveData: function (saveData) {
        // 数据保存到savedData中进行迁移。
        this.continueAbilityData.titleStr = this.titleStr;
        this.continueAbilityData.titleContent = this.titleContent;
        console.info("onSaveData: string = " + this.titleStr + "," + this.titleContent);
        var data = this.continueAbilityData;
        Object.assign(saveData, data)
        console.info("onSaveData: data = " + data.titleStr + data.titleContent);
    },
    onRestoreData: function (restoreData) {
        // 收到迁移数据，恢复。
        this.isRestore = true;
        this.continueAbilityData = restoreData;
        this.titleStr = this.continueAbilityData.titleStr;
        this.titleContent = this.continueAbilityData.titleContent;
        this.$refs.content.value = this.titleContent;
        console.info("onRestoreData: data = " + this.titleStr + ", " + this.titleContent);
    }
}
