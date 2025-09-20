import type { Meta, StoryObj } from '@storybook/react'
import { Home, Briefcase, Code, GraduationCap, MessageCircle, FileText, Sun, Settings } from 'lucide-react'

const MenuButton = ({ icon: Icon, label, isActive = false, hasNotification = false, ...props }: any) => {
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '20px',
    border: 'none',
    background: isActive ? '#e3f2fd' : '#f0f0f3',
    boxShadow: isActive 
      ? 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff'
      : '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
    color: isActive ? '#3b82f6' : '#666',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'system-ui, sans-serif',
    minWidth: '90px',
    justifyContent: 'center',
    position: 'relative' as const
  }

  return (
    <button style={buttonStyle} {...props}>
      <Icon size={16} />
      <span>{label}</span>
      {hasNotification && (
        <div style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          width: '8px',
          height: '8px',
          background: '#fbbf24',
          borderRadius: '50%'
        }} />
      )}
    </button>
  )
}

const IconButton = ({ icon: Icon, hasNotification = false, ...props }: any) => {
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: '#f0f0f3',
    boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const
  }

  return (
    <button style={buttonStyle} {...props}>
      <Icon size={16} />
      {hasNotification && (
        <div style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          width: '8px',
          height: '8px',
          background: '#fbbf24',
          borderRadius: '50%'
        }} />
      )}
    </button>
  )
}

const meta: Meta<typeof MenuButton> = {
  title: 'Components/MenuButtons',
  component: MenuButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: Home,
    label: 'Home',
    isActive: false,
  },
}

export const Active: Story = {
  args: {
    icon: Home,
    label: 'Home',
    isActive: true,
  },
}

export const WithNotification: Story = {
  args: {
    icon: FileText,
    label: 'CV',
    hasNotification: true,
  },
}

export const AllMenuButtons: Story = {
  render: () => (
    <div style={{ 
      background: '#f0f0f3', 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      minHeight: '100vh'
    }}>
      <div>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>Botones de Navegación</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <MenuButton icon={Home} label="Home" isActive={true} />
          <MenuButton icon={Briefcase} label="Projects" />
          <MenuButton icon={Code} label="Skills" />
          <MenuButton icon={GraduationCap} label="Experience" />
          <MenuButton icon={MessageCircle} label="Contact" />
        </div>
      </div>

      <div>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>Botones de Utilidad</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <IconButton icon={FileText} hasNotification={true} />
          <IconButton icon={Sun} />
          <IconButton icon={Settings} />
        </div>
      </div>

      <div>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>Logo</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 20px',
          borderRadius: '20px',
          background: '#f0f0f3',
          boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
          color: '#333',
          fontSize: '18px',
          fontWeight: 'bold',
          fontFamily: 'system-ui, sans-serif',
          minWidth: '70px'
        }}>
          EG
        </div>
      </div>
    </div>
  )
}
