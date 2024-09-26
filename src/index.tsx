import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
  ToggleField,
} from 'decky-frontend-lib'
import { useEffect, useState, VFC } from 'react'
import { FaPowerOff } from 'react-icons/fa'
import { IoIosInformationCircle } from 'react-icons/io'

const Content: VFC<{ serverAPI: ServerAPI; state: boolean }> = ({
  serverAPI,
  state,
}: {
  serverAPI: ServerAPI
  state: boolean
}) => {
  const [keepOn, setKeepOn] = useState<boolean>(false)

  const onChange = async (e: boolean) => {
    await serverAPI.callPluginMethod<{ state: boolean }, {}>(
      'set_save_settings',
      { state: e }
    )
    setKeepOn(e)
  }

  useEffect(() => {
    setKeepOn(state)
  }, [])

  return (
    <PanelSection>
      <PanelSectionRow>
        <ToggleField
          checked={keepOn}
          onChange={onChange}
          label="Keep your deck on"
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <div className={staticClasses.Label}>
          <IoIosInformationCircle />
          <div className={staticClasses.Text}>
            Note that deck will still dim if you set it on settings
          </div>
        </div>
      </PanelSectionRow>
    </PanelSection>
  )
}

export default definePlugin((serverApi: ServerAPI) => {
  let state = false

  ;async () => {
    const res = await serverApi.callPluginMethod<{}, boolean>(
      'get_save_settings',
      {}
    )
    if (res.success) {
      state = res.result
    }
  }

  return {
    title: <div className={staticClasses.Title}>Keep On</div>,
    content: <Content serverAPI={serverApi} state={state} />,
    icon: <FaPowerOff />,
    onDismount() {},
  }
})
