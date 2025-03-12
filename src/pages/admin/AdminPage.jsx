import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AdminPage() {
  return (
    <div>
        <h1>AdminPage</h1>
        <Outlet/>
    </div>
  )
}
