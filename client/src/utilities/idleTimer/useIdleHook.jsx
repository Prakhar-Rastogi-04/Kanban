import { useIdleTimer } from 'react-idle-timer'
import { useEffect, useState } from 'react'


export default function useIdleHook ({onIdle,onPrompt, idleTime}) {
    const promptBeforeIdle = 5_000;
    const [isIdle, setIsIdle] = useState();
    const [remaintingTime, setRemainingTime] = useState();
    const handleOnIdle = event => {
        setIsIdle(true);
        console.log("user is idle", event)
        console.log("Last Active", getLastActiveTime())
        onIdle()
    }
    const {getRemainingTime, getLastActiveTime, activate} = useIdleTimer({
        timeout: 1000 * 10 * idleTime,
        onIdle: handleOnIdle,
        debounce: 500,
        onPrompt,
        promptBeforeIdle
    })

    useEffect(()=>{
        const interval = setInterval(() => {
            setRemainingTime(Math.ceil(getRemainingTime() / 1000))
          }, 500)
      
          return () => {
            clearInterval(interval)
          }
    })
    
    return {
        getRemainingTime,
        getLastActiveTime,
        activate,
        remaintingTime,
        isIdle
    }
}