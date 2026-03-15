import Image from 'next/image'
import React from 'react'
import VoiceAgent from './caller'
import VoiceAgentUI from '@/components/ui/ai-ui'
import VoiceAssistant from './agent'

const page = () => {
    return (
        <div className='w-full min-h-screen' >
            {/* call bar component */}
           <div className='w-full h-screen flex flex-col items-center justify-center'>
            

                <VoiceAgent />
                {/* <VoiceAssistant/> */}
                {/* <VoiceAgentUI/> */}
               


           </div>
            {/* call chat component */}

            
            </div>
    )
}

export default page