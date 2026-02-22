import React from 'react'
import { LoginForm } from "@/components/login-form"
import { MdNextWeek } from "react-icons/md";
import { HexagonBackground } from "@/components/animate-ui/components/backgrounds/hexagon"
function Auth() {
  
  return (
    <div className="dark flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <HexagonBackground className="absolute inset-0 -z-10 h-full w-full" />
      <div className="w-full max-w-sm">
        <h4 className="text-lg font-semibold ml-19"> <MdNextWeek className="inline-block mr-2 mb-1" />Welcome to NextHire</h4>
        <LoginForm />
      </div>
    </div>
  )
}

export default Auth