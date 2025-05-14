
interface LoadingStateProps {
  loading: boolean;
}

const LoadingState = ({ loading }: LoadingStateProps) => {
  if (!loading) return null;
  
  return (
    <div className="flex justify-center my-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
    </div>
  );
};

export default LoadingState;
