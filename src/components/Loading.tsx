const Loading = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

      <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default Loading;
