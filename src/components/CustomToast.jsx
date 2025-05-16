import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const CustomToast = {
  success(message, options = {}) {
    return toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white dark:bg-slate-900 shadow-lg rounded-lg pointer-events-auto relative overflow-hidden border border-l-4 border-green-500 dark:border-slate-700 dark:border-l-green-500`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-green-500 mb-1">
                  Thành công
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-5">
                  {message}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="text-right">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
          <div className="h-1 bg-green-500 animate-progress" style={{width: '100%'}} />
        </div>
      ),
      {
        duration: 200,
        ...options,
      }
    );
  },

  error(message, options = {}) {
    return toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white dark:bg-slate-900 shadow-lg rounded-lg pointer-events-auto relative overflow-hidden border border-l-4 border-red-500 dark:border-slate-700 dark:border-l-red-500`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-red-500 mb-1">
                  Lỗi
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-5">
                  {message}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="text-right">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
          <div className="h-1 bg-red-500 animate-progress" style={{width: '100%'}} />
        </div>
      ),
      {
        duration: 200,
        ...options,
      }
    );
  },

  warning(message, options = {}) {
    return toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white dark:bg-slate-900 shadow-lg rounded-lg pointer-events-auto relative overflow-hidden border border-l-4 border-yellow-500 dark:border-slate-700 dark:border-l-yellow-500`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-yellow-500 mb-1">
                  Cảnh báo
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-5">
                  {message}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="text-right">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
          <div className="h-1 bg-yellow-500 animate-progress" style={{width: '100%'}} />
        </div>
      ),
      {
        duration: 200,
        ...options,
      }
    );
  },

  info(message, options = {}) {
    return toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white dark:bg-slate-900 shadow-lg rounded-lg pointer-events-auto relative overflow-hidden border border-l-4 border-blue-500 dark:border-slate-700 dark:border-l-blue-500`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Info className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-blue-500 mb-1">
                  Thông tin
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-5">
                  {message}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="text-right">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
          <div className="h-1 bg-blue-500 animate-progress" style={{width: '100%'}} />
        </div>
      ),
      {
        duration: 200,
        ...options,
      }
    );
  },
};

export default CustomToast; 