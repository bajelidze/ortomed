import { ref } from 'vue';
import { defineStore } from 'pinia';
import { SettingsValue } from '../../common/interfaces';

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<SettingsValue>();

  async function get(): Promise<SettingsValue> {
    if (settings.value == undefined) {
      settings.value = await window.api.settings.get();
    }

    return settings.value as SettingsValue;
  }

  async function commit() {
    if (settings.value == undefined) {
      return;
    }

    const parsed = JSON.parse(JSON.stringify(settings.value));

    await window.api.settings.set(parsed);
  }

  return { settings, get, commit };
});
