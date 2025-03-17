import React from 'react'
import Sidebar from '../../components/Sidebar';
import { Outlet } from 'react-router-dom'

export default function AdminPage() {
  return (
    <div>
      <noscript>
        "<strong>
          We're sorry but fontend doesn't work properly without JavaScript enabled. Please enable it to continue
        </strong>""
      </noscript>
        <div className='flex flex-col h-screen w-screen'>
          <header>
            Admin Page
          </header>
          <main className='flex flex-row h-screen w-screen'>
            <Sidebar></Sidebar>
              <div className="content">
                <Outlet/>
              </div>
          </main>
          
        </div>
    </div>
  )
}
