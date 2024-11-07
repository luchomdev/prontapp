import { Inbox } from 'lucide-react';

interface NoDataProps {
  message: string;
}

export default function NoData({ message }: NoDataProps) {
  return (
    <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-4">
      <div className="bg-gray-50 rounded-full p-6 mb-4">
        <Inbox className="w-12 h-12 text-gray-400" />
      </div>
      <p className="text-gray-500 text-center text-lg">{message}</p>
    </div>
  );
}