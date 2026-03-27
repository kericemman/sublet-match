const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="text-sm text-gray-500">{text}</div>
    </div>
  );
};

export default Loader;