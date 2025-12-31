import useBoolean from './useBoolean';

export default function useLoading(initValue = false) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading, setBool: setLoading } = useBoolean(initValue);

  return {
    loading,
    startLoading,
    endLoading,
    setLoading
  };
}
