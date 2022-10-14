import Image from 'next/image'
import React from 'react'

const Header = () => {
    return (
      <>
        <div className='header-section fixed flex flex-row items-start justify-between w-full px-20 py-5'>
          <div className='flex flex-row items-center'>
            <a href='https://deso.com' className='flex flex-row items-center justify-center'>
              <Image src="/logo-deso-white.svg" alt="Deso Logo" width={100} height={35} />
            </a>
            <h3 className='font-semibold ml-2 text-[#daedff]'>/</h3>
            <h3 className='font-semibold ml-2 text-[#daedff]'>Embed</h3>
          </div>
        </div>
      </>
    )
}

export default Header