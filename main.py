import json
import os
import configparser

import decky_plugin

class Plugin:
    async def get_save_settings(self) -> list[bool, bool]:
        completePath = os.path.join(decky_plugin.DECKY_PLUGIN_SETTINGS_DIR, "settings", "keep-on.json")

        if (os.path.exists(completePath)):
            with open(completePath, "r") as f:
                data = json.load(f)

                sleepState = bool(data["sleepState"])
                dimState = bool(data["dimState"])

                return [sleepState, dimState]
        else:
            return [False, False]
    
    async def set_save_settings(self, sleepState: bool, dimState: bool):
        completePath = os.path.join(decky_plugin.DECKY_PLUGIN_SETTINGS_DIR, "settings", "keep-on.json")

        data = {
            "sleepState": sleepState,
            "dimState": dimState
        }

        with open(completePath, "w") as f:
            json.dump(data, f, indent=4)

    async def set_system_sleep(self, sleepState: bool):
        sleepFilePath = os.path.join("etc", "systemd", "sleep.conf")

        config = configparser.ConfigParser()
        config.read(sleepFilePath)

        if (sleepState):
            config.set("Sleep", "AllowSuspend", "no")
        else:
            config.set("Sleep", "AllowSuspend", "yes")

        with open(sleepFilePath, "w") as sleepConfigFile:
            config.write(sleepConfigFile)

    async def set_system_dim(self, dimState: bool):
        sleepFilePath = os.path.join("etc", "systemd", "sleep.conf")

        config = configparser.ConfigParser()
        config.read(sleepFilePath)

        if (dimState):
            config.set("Sleep", "AllowSuspend", "no")
        else:
            config.set("Sleep", "AllowSuspend", "yes")

        with open(sleepFilePath, "w") as sleepConfigFile:
            config.write(sleepConfigFile)

    async def _main(self):
        decky_plugin.logger.info("Hello World!")

    async def _unload(self):
        decky_plugin.logger.info("Goodnight World!")
        pass

    async def _uninstall(self):
        decky_plugin.logger.info("Goodbye World!")
        pass

    async def _migration(self):
        decky_plugin.logger.info("Migrating")
        decky_plugin.migrate_logs(os.path.join(decky_plugin.DECKY_USER_HOME,
                                               ".config", "keep-on", "keep-on.log"))
        decky_plugin.migrate_settings(
            os.path.join(decky_plugin.DECKY_HOME, "settings", "keep-on.json"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".config", "keep-on"))
        decky_plugin.migrate_runtime(
            os.path.join(decky_plugin.DECKY_HOME, "keep-on"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".local", "share", "keep-on"))
