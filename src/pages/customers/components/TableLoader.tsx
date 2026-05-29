export default function TableLoader({ isLoading }: { isLoading?: boolean }) {
  return (
    <div className="h-[3px] w-full relative overflow-hidden bg-[#0051bb]/10 shrink-0">
      {isLoading && (
        <div 
          className="h-full bg-[#0051bb] absolute left-0 top-0 rounded-full"
          style={{
            animation: 'shimmer 1.5s infinite ease-in-out',
            width: '40%'
          }}
        />
      )}
      <style>{`
        @keyframes shimmer {
          0% { left: -40%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
