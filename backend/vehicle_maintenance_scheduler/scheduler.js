// vehicle_maintenance_scheduler/scheduler.js

function buildSchedule(taskList, maxHours) {
  // Step 1: add efficiency score to each task
  const processedTasks = taskList.map((task, index) => {
    return {
      id: index,
      duration: task.duration,
      impact: task.impact,
      efficiency: task.impact / task.duration
    };
  });

  // Step 2: sort tasks by efficiency (descending)
  processedTasks.sort((a, b) => b.efficiency - a.efficiency);

  let remainingTime = maxHours;
  const chosenTasks = [];

  // Step 3: pick best tasks within limit
  for (let i = 0; i < processedTasks.length; i++) {
    const currentTask = processedTasks[i];

    if (currentTask.duration <= remainingTime) {
      chosenTasks.push(currentTask);
      remainingTime -= currentTask.duration;
    }
  }

  return {
    totalTasks: chosenTasks.length,
    remainingTime,
    tasks: chosenTasks
  };
}

module.exports = buildSchedule;