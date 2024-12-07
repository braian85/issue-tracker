'use client'

import { FC } from 'react'

interface LoaderProps {
  className?: string
}

const Loader: FC<LoaderProps> = ({ className = '' }) => {
  return (
    <div className={`inline-block relative w-20 h-20 ${className}`}>
      <style jsx>{`
        @keyframes lds-roller {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        div > div {
          animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          transform-origin: 40px 40px;
        }

        div > div:after {
          content: " ";
          display: block;
          position: absolute;
          width: 7.2px;
          height: 7.2px;
          border-radius: 50%;
          background: currentColor;
          margin: -3.6px 0 0 -3.6px;
        }

        div > div:nth-child(1) { animation-delay: -0.036s; }
        div > div:nth-child(1):after { top: 62.63px; left: 62.63px; }
        
        div > div:nth-child(2) { animation-delay: -0.072s; }
        div > div:nth-child(2):after { top: 67.71px; left: 56px; }
        
        div > div:nth-child(3) { animation-delay: -0.108s; }
        div > div:nth-child(3):after { top: 70.91px; left: 48.28px; }
        
        div > div:nth-child(4) { animation-delay: -0.144s; }
        div > div:nth-child(4):after { top: 72px; left: 40px; }
        
        div > div:nth-child(5) { animation-delay: -0.18s; }
        div > div:nth-child(5):after { top: 70.91px; left: 31.72px; }
        
        div > div:nth-child(6) { animation-delay: -0.216s; }
        div > div:nth-child(6):after { top: 67.71px; left: 24px; }
        
        div > div:nth-child(7) { animation-delay: -0.252s; }
        div > div:nth-child(7):after { top: 62.63px; left: 17.37px; }
        
        div > div:nth-child(8) { animation-delay: -0.288s; }
        div > div:nth-child(8):after { top: 56px; left: 12.29px; }
      `}</style>
      <div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default Loader
