class ProjectStatus {
  static status(status) {
    let statusText;
    let statusColor;
    if (status === 1) {
      statusText = "Looking for students";
      statusColor = "#52c41a";
    } else if (status === 2) {
      statusText = "In progress";
      statusColor = "#1677ff";
    } else if (status === 3) {
      statusText = "Completed";
      statusColor = "#9641b0";
    } else {
      statusText = "Closed";
      statusColor = "gray";
    }
    return { statusText: statusText, statusColor: statusColor };
  }
}

export default ProjectStatus;