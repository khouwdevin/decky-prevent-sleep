import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
  ToggleField,
} from 'decky-frontend-lib'
import { useState, VFC } from 'react'
import { FaPowerOff } from 'react-icons/fa'
import { IoIosInformationCircle } from 'react-icons/io'

const Content: VFC<{
  serverAPI: ServerAPI
  sleepState: boolean
  dimState: boolean
}> = ({ serverAPI, sleepState, dimState }) => {
  const [keepOn, setKeepOn] = useState<boolean>(sleepState)
  const [dimOff, setDimOff] = useState<boolean>(dimState)

  const onChangeSleep = (e: boolean) => {
    serverAPI.callPluginMethod<{ sleepState: boolean; dimState: boolean }, {}>(
      'set_save_settings',
      { sleepState: e, dimState: dimOff }
    )
    serverAPI.callPluginMethod<{ sleepState: boolean }, {}>(
      'set_system_sleep',
      {
        sleepState: e,
      }
    )

    setKeepOn(e)
  }

  const onChangeDim = (e: boolean) => {
    serverAPI.callPluginMethod<{ sleepState: boolean; dimState: boolean }, {}>(
      'set_save_settings',
      { sleepState: keepOn, dimState: e }
    )
    serverAPI.callPluginMethod<{ dimState: boolean }, {}>('set_system_dim', {
      dimState: e,
    })

    setDimOff(e)
  }

  return (
    <PanelSection>
      <PanelSectionRow>
        <ToggleField
          checked={keepOn}
          onChange={onChangeSleep}
          label="Keep your deck on"
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <ToggleField
          checked={dimOff}
          onChange={onChangeDim}
          label="Disable dim screen"
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <div className={staticClasses.Label}>
          <IoIosInformationCircle />
          <div className={staticClasses.Text}>
            Note that this plugin still in development use it with caution
          </div>
        </div>
      </PanelSectionRow>
    </PanelSection>
  )
}

export default definePlugin((serverApi: ServerAPI) => {
  let sleepState = false
  let dimState = false

  ;async () => {
    const res = await serverApi.callPluginMethod<{}, boolean[]>(
      'get_save_settings',
      {}
    )
    if (res.success) {
      sleepState = res.result[0]
      dimState = res.result[1]
    }
  }

  return {
    title: <div className={staticClasses.Title}>Keep On</div>,
    content: (
      <Content
        serverAPI={serverApi}
        sleepState={sleepState}
        dimState={dimState}
      />
    ),
    icon: <FaPowerOff />,
    onDismount() {},
  }
})
