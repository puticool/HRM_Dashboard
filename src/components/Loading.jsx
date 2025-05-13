const Loading = () => {
  return (
    <div className="flex h-[calc(100vh-140px)] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 size-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
};

export default Loading; 