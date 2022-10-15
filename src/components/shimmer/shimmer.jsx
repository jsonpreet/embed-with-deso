import React from 'react'
import { ShimmerCard, ShimmerTitle, ShimmerText, ShimmerButton, ShimmerCircularImage, ShimmerThumbnail, ShimmerSocialPost } from "react-shimmer-effects";

const Shimmer = () => {
    return (
        <>
            <ShimmerCard>
                <div className='flex border border-gray-100 p-4 rounded flex-col'>
                    <div className='flex flex-row'>
                        <ShimmerCircularImage />
                        <div className='flex-1 p-4'>
                            <ShimmerTitle variant="secondary" />
                        </div>
                    </div>
                    <ShimmerText line={2} />
                    <ShimmerThumbnail height={150} rounded />
                    <div className='flex py-4 flex-row justify-between'>
                        <ShimmerTitle line={1} className="w-[10%]" variant="secondary" />
                        <ShimmerTitle line={1} className="w-[10%]" variant="secondary" />
                        <ShimmerTitle line={1} className="w-[10%]" variant="secondary" />
                        <ShimmerTitle line={1} className="w-[10%]" variant="secondary" />
                        <ShimmerTitle line={1} className="w-[10%]" variant="secondary" />
                    </div>
                </div>
            </ShimmerCard>
        </>
    )
}

export default Shimmer