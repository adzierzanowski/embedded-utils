import { ReactNode, useState } from "react"
import './Tabs.scss'

export interface TabsPanel {
  name: string,
  label: ReactNode,
  shortcut?(e: KeyboardEvent): boolean
}

export type TabsProps = {
  panels: TabsPanel[]
  activePanel: string
  children?: ReactNode
  onPanelChange?: (panel: string) => void
}

export const Tabs = ({panels, activePanel, children, onPanelChange}: TabsProps) => {
  return (
    <div className="tabs">
      <nav className="tabs__nav">
        {panels.map(p => (
          <button
            key={p.name}
            className={activePanel === p.name ? 'active' : ''}
            onClick={() => onPanelChange?.(p.name)}>
            {p.label}
          </button>
        ))}
      </nav>
      <div className="tabs__panels">
        {children}
      </div>
    </div>
  )
}
