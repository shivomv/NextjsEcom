export default function DecorativeBorder({ className = "" }) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="flex justify-center">
        <div className="h-4 w-full relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-px w-full bg-primary/20"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-2">
              {[...Array(9)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-2 h-2 rounded-full bg-primary/40"
                  style={{
                    animation: `pulse 2s infinite ${i * 0.2}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
