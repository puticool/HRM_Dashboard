import PropTypes from 'prop-types';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-50 bg-white rounded-lg shadow-xl sm:max-w-lg w-full mx-4 p-6 dark:bg-slate-800 dark:border dark:border-slate-700"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            {message}
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors focus:ring-2 focus:ring-red-500/20 dark:bg-red-600 dark:hover:bg-red-700"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:bg-slate-800"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
};

ConfirmDialog.defaultProps = {
  title: 'Xác nhận',
  message: 'Bạn có chắc chắn muốn thực hiện thao tác này?',
};

export default ConfirmDialog;
