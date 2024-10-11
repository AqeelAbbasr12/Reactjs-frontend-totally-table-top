import React,{useState} from 'react'
function Feature() {
    const [enabled, setEnabled] = useState(false);
    return (
        <>
            <div className='bg-[#0D2539] w-full'>
                {/* Feature */}
                <div className='w-10/12 bg-[#0D2539] mx-auto h-[102px] flex justify-between items-center'>
                    <div>
                        <span className='text-lg leading-10 md:text-28 md:leading-35 tracking-[0.56px]'>Feature?</span>
                    </div>

                    <div>
                        {enabled && (
                            <span className='font-mulish text-sm leading-7 md:text-lg md:leading-28 text-black bg-[#F3C15F] me-2 w-[104px]'>FEATURED</span>
                        )}
                        <div className={`relative inline-flex items-center h-[36px] rounded-full w-[54px] transition-colors duration-300 ease-in-out ${enabled ? 'bg-yellow-500' : 'bg-gray-300'}`}
                            onClick={() => setEnabled(!enabled)} >
                            <span className={`inline-block w-5 h-5 transform rounded-full transition-transform duration-300 ease-in-out ${enabled ? 'bg-white translate-x-6' : 'bg-blue-600 translate-x-2'}`} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Feature;