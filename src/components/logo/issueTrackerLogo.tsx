import React from 'react'

const IssueTrackerLogo: React.FC = () => {
  return (
    <svg
      width='200'
      height='50'
      viewBox='0 0 200 50'
      xmlns='http://www.w3.org/2000/svg'
    >
      <text
        x='10'
        y='35'
        fontFamily='Arial, sans-serif'
        fontSize='24'
        fontWeight='bold'
        fill='#9D9D9D'
      >
        Issue<tspan fill='#B52C2C'>TRACKER</tspan>
      </text>
    </svg>
  )
}

export default IssueTrackerLogo
