import { NeuromorphicEG } from '@/components/neuromorphic-eg'

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
      {/* Menú minimalista de 3 líneas */}
      <div className="absolute top-8 left-8 z-50">
        <button className="flex flex-col gap-1 p-2">
          <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400"></div>
          <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400"></div>
          <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400"></div>
        </button>
      </div>
      
      {/* EG neuromórfico como elementos reales - subido */}
      <div className="pt-8">
        <NeuromorphicEG />
      </div>
    </div>
  );
}
