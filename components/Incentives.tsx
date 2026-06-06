import { incentives } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

const Incentives = () => {
  return (
    <section className="bg-[#f4f9f0] border-b border-brand/10 py-12">
      <div className="mx-auto max-w-screen-2xl px-10 max-sm:px-5">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10 uppercase tracking-wide">
          Почему выбирают нас
        </h2>
        <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1 max-md:max-w-sm max-md:mx-auto">
          {incentives.map((incentive) => (
            <div key={incentive.name} className="flex items-start gap-x-4 p-6 rounded-2xl bg-white border-2 border-brand/10 hover:border-brand hover:shadow-md transition-all">
              <div className="flex-shrink-0 w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center">
                <Image width={28} height={28} src={incentive.imageSrc} alt={incentive.name} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-1">{incentive.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{incentive.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Incentives
