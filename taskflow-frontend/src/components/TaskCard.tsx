
type TaskCardProps = {
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  onMarkCompleted: () => void;
};

function TaskCard({
  title,
  status,
  onMarkCompleted
}: TaskCardProps) {
  return (
    <div className="task-card-header">
      <h3>{title}</h3>

      <button
        className="button button-success"
        onClick={onMarkCompleted}
        disabled={status === 'Completed'}
      >
        Mark Completed
      </button>
    </div>
  );
}

export default TaskCard;
