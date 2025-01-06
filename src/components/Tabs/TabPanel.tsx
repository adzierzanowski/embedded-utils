import React from "react"
import './Tabs.scss'

export type TabPanelProps = {
  active: boolean
  children?: React.ReactNode
  id?: string
}

export const TabPanel = ({active, children, id}: TabPanelProps) => {
  if (!active) {
    return null
  }

  return (
    <div className="tab__panel" id={id}>
      {children}
    </div>
  )
}
