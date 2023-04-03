/* eslint-disable @next/next/no-img-element */
import Linkify from "linkify-react";
import "linkify-plugin-hashtag";
import "linkify-plugin-mention";
import * as ga from '@/lib/ga'

const Profile = ({ exchangeRate, followers, following, profile, nodes }) => {
    const node = nodes[1]

    //const nodeURL = (node.URL !== '') ? node.URL : `https://node.deso.org`;
    const nodeURL = `https://node.deso.org`;

    const LinkifyRenderLink = ({ attributes, content }) => {
        const { href, ...props } = attributes;
        return <a href={href} target='_blank' className='text-[#007bff] hover:text-[#0056b3] hover:underline' rel="noopener noreferrer nofollow" {...props}>{content}</a>;
    };

    const LinkifyOptions = {
        formatHref: {
            hashtag: (href) => `${nodeURL}/hashtag/` + href.substr(1).toLowerCase(),
            mention: (href) => `${nodeURL}/` + href.substr(1).toLowerCase(),
        },
        render: {
            mention: LinkifyRenderLink,
            hashtag: LinkifyRenderLink,
            url: ({ attributes, content }) => {
                return <a {...attributes} className='text-[#007bff] hover:text-[#0056b3] hover:underline' rel="noopener noreferrer nofollow" target="_blank">{content}</a>
            },
        },
        nl2br: true
    };

    const handleClick = (url) => {
        window.open(url, '_blank');
        ga.event({
            action: "profile link clicked",
            params : {
                profile: profile.PublicKeyBase58Check
            }
        })
    }

    return (
        <div className={` flex bg-white border hover:bg-gray-100/50 transition duration-100 justify-center items-center mx-auto border-gray-200 p-[15px] flex-row max-w-[500px]`}>
            <div className='w-full flex-1' onClick={() => handleClick(`${nodeURL}/u/${profile.Username}`)} rel="noopener noreferrer nofollow" target='_blank' style={{ cursor: 'pointer'}}>
                <div className='flex flex-row items-start w-full'>
                    <div className='flex flex-col w-full'>
                        <div className='flex flex-row items-center'>
                            <div className='mr-2'>
                                <a href={`${nodeURL}/u/${profile?.Username}`} target='_blank' rel="noopener noreferrer nofollow">
                                    <img alt={profile.Username} className='rounded-full' src={profile?.ExtraData?.LargeProfilePicURL || `https://node.deso.org/api/v0/get-single-profile-picture/${profile?.PublicKeyBase58Check}`} width={50} height={50} style={{ width: '50px', height: '50px'}} />
                                </a>
                            </div>
                            <div className='flex flex-row w-full items-center'>
                                <div className='flex flex-col w-full items-start justify-center'>
                                    <div className='flex flex-row w-full justify-between items-center'>
                                        <div className="flex flex-row items-center">
                                            <a rel="noopener noreferrer nofollow" href={`${nodeURL}/u/${profile?.Username}`} className='leading-none font-semibold text-black hover:underline hover:text-[#0056b3] text-[15px]' target='_blank'>{profile?.Username}</a>
                                            {profile?.IsVerified && <span className='verified w-4 h-4 ml-[2px]'>Verified</span>}
                                            <span className='bg-gray-100 px-[12px] py-[4px] text-[13px] font-semibold text-gray-700 rounded-full ml-2'>
                                                ~${((profile?.CoinPriceDeSoNanos / 1000000000) * exchangeRate).toFixed(2)}
                                            </span>
                                        </div>
                                        <div>
                                            <a rel="noopener noreferrer nofollow" target="_blank" className='ml-1 bg-[#007bff] hover:bg-[#125194] text-white rounded-full px-3 py-[8px] text-[12px]' href={`${nodeURL}/${profile?.Username}`}>Buy Now</a>
                                        </div>
                                    </div>
                                    <div className='flex flex-row items-center'>
                                        <a rel="noopener noreferrer nofollow" href={`${nodeURL}/u/${profile?.Username}`} className='text-[#007bff] hover:text-[#0056b3] font-semibold text-[13px] hover:underline' target='_blank'>Follow</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='mt-2 text-[15px] break-words body'>
                                <Linkify options={LinkifyOptions}>
                                    {profile.Description}
                                </Linkify>
                            </div>
                            <div className="flex mt-2 flex-row">
                                <div>
                                    <a rel="noopener noreferrer nofollow" href={`${nodeURL}/u/${profile?.Username}`} className='text-black font-semibold text-[14px]' target='_blank'>{followers}
                                    <span className="text-gray-500 ml-1 font-normal">Followers</span>
                                    </a>
                                </div>
                                <div className='ml-2'>
                                    <a rel="noopener noreferrer nofollow" href={`${nodeURL}/u/${profile?.Username}`} className='text-black font-semibold text-[14px]' target='_blank'>{following} 
                                        <span className="text-gray-500 ml-1 font-normal">Following</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile