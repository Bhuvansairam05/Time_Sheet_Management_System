const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  );
};

export default Loader;