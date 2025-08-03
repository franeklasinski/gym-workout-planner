class WorkoutPlanner {
    constructor() {
        console.log('WorkoutPlanner constructor called');
        this.workouts = JSON.parse(localStorage.getItem('workouts')) || [];
        this.completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts')) || [];
        this.dailyTasks = JSON.parse(localStorage.getItem('dailyTasks')) || {};
        this.customTasks = JSON.parse(localStorage.getItem('customTasks')) || [];
        this.goals = localStorage.getItem('goals') || '';
        this.measurements = JSON.parse(localStorage.getItem('measurements')) || [];
        this.weightGoal = parseFloat(localStorage.getItem('weightGoal')) || null;
        this.currentWorkout = null;
        this.currentTab = 'add-workout';
        this.currentDate = new Date();
        console.log('Loaded workouts:', this.workouts.length);
        console.log('Loaded measurements:', this.measurements.length);
        this.init();
    }

    init() {
        console.log('Initializing WorkoutPlanner...');
        this.bindEvents();
        this.renderWeeklyPlan();
        this.updateStats();
        this.initTabs();
        this.initCalendar();
        this.initDailyTasks();
        this.initBodyStats();
        this.loadGoals();
        this.setBodyClass();
        console.log('WorkoutPlanner initialized successfully');
    }

    bindEvents() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        const workoutForm = document.getElementById('workout-form');
        if (workoutForm) {
            workoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addWorkout();
            });
        }

        const exerciseForm = document.getElementById('exercise-form');
        if (exerciseForm) {
            exerciseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addExercise();
            });
        }

        const finishBtn = document.getElementById('finish-workout');
        if (finishBtn) {
            finishBtn.addEventListener('click', () => {
                this.finishWorkout();
            });
        }

        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const modal = document.getElementById('workout-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'workout-modal') {
                    this.closeModal();
                }
            });
        }

        const deleteBtn = document.getElementById('delete-workout');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteCurrentWorkout();
            });
        }

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('workout-modal');
            if (modal && e.target === modal) {
                this.closeModal();
            }
        });

        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.renderCalendar();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.renderCalendar();
            });
        }

        const addTaskBtn = document.getElementById('add-task-btn');
        const customTaskInput = document.getElementById('custom-task-input');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                this.addCustomTask();
            });
        }
        if (customTaskInput) {
            customTaskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addCustomTask();
                }
            });
        }

        const saveGoalsBtn = document.getElementById('save-goals-btn');
        if (saveGoalsBtn) {
            saveGoalsBtn.addEventListener('click', () => {
                this.saveGoals();
            });
        }

        const measurementForm = document.getElementById('measurement-form');
        if (measurementForm) {
            measurementForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addMeasurement();
            });
        }

        const setGoalBtn = document.getElementById('set-goal-btn');
        if (setGoalBtn) {
            setGoalBtn.addEventListener('click', () => {
                this.setWeightGoal();
            });
        }
    }

    initTabs() {
        console.log('Initializing tabs...');
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.switchTab('add-workout');
        console.log('Tabs initialized');
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(`${tabName}-tab`);
        
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        if (activeContent) {
            activeContent.classList.add('active');
        }
        
        this.currentTab = tabName;
        this.setBodyClass();
        
        if (tabName === 'statistics') {
            setTimeout(() => {
                this.updateCharts();
                this.loadGoals();
                this.renderBodyStats();
                this.updateWeightChart();
            }, 100);
        }
        
        if (tabName === 'weekly-plan') {
            setTimeout(() => {
                this.renderCalendar();
                this.renderDailyTasks();
                this.renderWorkoutHistory();
            }, 100);
        }
    }

    setBodyClass() {
        document.body.classList.remove('tab-add-workout', 'tab-weekly-plan', 'tab-statistics');
        document.body.classList.add(`tab-${this.currentTab}`);
    }

    addWorkout() {
        const name = document.getElementById('workout-name').value;
        const day = document.getElementById('workout-day').value;
        const duration = document.getElementById('workout-duration').value || 60;
        
        const muscleGroups = Array.from(document.querySelectorAll('.muscle-groups-container input:checked'))
            .map(cb => cb.value);

        if (muscleGroups.length === 0) {
            alert('Wybierz przynajmniej jedną partię mięśniową!');
            return;
        }

        const workout = {
            id: Date.now(),
            name,
            day,
            muscleGroups,
            duration: parseInt(duration),
            exercises: [],
            createdAt: new Date().toISOString()
        };

        this.workouts.push(workout);
        this.currentWorkout = workout;
        this.saveToStorage();
        
        this.showExercisesPanel();
        
        document.getElementById('workout-form').reset();
        
        this.renderWeeklyPlan();
        this.updateStats();
    }

    showExercisesPanel() {
        const panel = document.getElementById('exercises-panel');
        panel.style.display = 'block';
        
        document.getElementById('current-workout-name').textContent = this.currentWorkout.name;
        document.getElementById('current-workout-day').textContent = this.currentWorkout.day;
        
        this.renderCurrentExercises();
        
        panel.scrollIntoView({ behavior: 'smooth' });
    }

    addExercise() {
        if (!this.currentWorkout) return;

        const name = document.getElementById('exercise-name').value;
        const sets = parseInt(document.getElementById('exercise-sets').value);
        const reps = document.getElementById('exercise-reps').value;
        const weight = document.getElementById('exercise-weight').value;
        const notes = document.getElementById('exercise-notes').value;

        const exercise = {
            id: Date.now(),
            name,
            sets,
            reps,
            weight,
            notes
        };

        this.currentWorkout.exercises.push(exercise);
        this.saveToStorage();
        
        document.getElementById('exercise-form').reset();
        
        this.renderCurrentExercises();
        this.updateStats();
    }

    renderCurrentExercises() {
        const list = document.getElementById('exercises-list');
        list.innerHTML = '';

        if (!this.currentWorkout || this.currentWorkout.exercises.length === 0) {
            list.innerHTML = '<li style="color: #718096; font-style: italic;">Brak ćwiczeń</li>';
            return;
        }

        this.currentWorkout.exercises.forEach(exercise => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${exercise.name}</strong><br>
                ${exercise.sets} serie × ${exercise.reps} powtórzeń
                ${exercise.weight ? ` (${exercise.weight} kg)` : ''}
                ${exercise.notes ? `<br><em style="color: #718096;">${exercise.notes}</em>` : ''}
            `;
            list.appendChild(li);
        });
    }

    finishWorkout() {
        this.currentWorkout = null;
        document.getElementById('exercises-panel').style.display = 'none';
        this.renderWeeklyPlan();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        alert('Trening został zapisany! 💪');
    }

    renderWeeklyPlan() {
        const days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
        
        days.forEach(day => {
            const dayColumn = document.querySelector(`[data-day="${day}"] .workouts-container`);
            dayColumn.innerHTML = '';
            
            const dayWorkouts = this.workouts.filter(workout => workout.day === day);
            
            if (dayWorkouts.length === 0) {
                dayColumn.innerHTML = '<p style="color: #a0aec0; font-style: italic; text-align: center; margin-top: 20px;">Dzień odpoczynku</p>';
            } else {
                dayWorkouts.forEach(workout => {
                    const workoutCard = document.createElement('div');
                    workoutCard.className = 'workout-card';
                    workoutCard.innerHTML = `
                        <h4>${workout.name}</h4>
                        <div class="muscle-groups">${workout.muscleGroups.join(', ')}</div>
                        <div class="duration">${workout.duration} min • ${workout.exercises.length} ćwiczeń</div>
                    `;
                    
                    workoutCard.addEventListener('click', () => {
                        this.showWorkoutModal(workout);
                    });
                    
                    dayColumn.appendChild(workoutCard);
                });
            }
        });
    }

    showWorkoutModal(workout) {
        const modal = document.getElementById('workout-modal');
        const title = document.getElementById('modal-workout-title');
        const details = document.getElementById('modal-workout-details');
        
        title.textContent = workout.name;
        
            details.innerHTML = `
                <div class="modal-workout-info">
                    <p><strong>Dzień:</strong> ${workout.day}</p>
                    <p><strong>Partie mięśniowe:</strong> ${workout.muscleGroups.join(', ')}</p>
                    <p><strong>Czas:</strong> ${workout.duration} minut</p>
                    <p><strong>Liczba ćwiczeń:</strong> ${workout.exercises.length}</p>
                </div>
                
                ${workout.exercises.length > 0 ? `
                    <div class="modal-exercises-list">
                        <h4>Lista ćwiczeń:</h4>
                        ${workout.exercises.map(exercise => `
                            <div class="modal-exercise-item">
                                <strong>${exercise.name}</strong><br>
                                ${exercise.sets} serie × ${exercise.reps} powtórzeń
                                ${exercise.weight ? ` • ${exercise.weight} kg` : ''}
                                ${exercise.notes ? `<br><em style="color: #718096;">${exercise.notes}</em>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : '<p style="color: #718096; font-style: italic;">Brak ćwiczeń w tym treningu</p>'}
            `;
            
            document.getElementById('delete-workout').dataset.workoutId = workout.id;
            
            modal.style.display = 'block';
        }    closeModal() {
        document.getElementById('workout-modal').style.display = 'none';
    }

    deleteCurrentWorkout() {
        const workoutId = parseInt(document.getElementById('delete-workout').dataset.workoutId);
        
        if (confirm('Czy na pewno chcesz usunąć ten trening?')) {
            this.workouts = this.workouts.filter(workout => workout.id !== workoutId);
            this.saveToStorage();
            this.closeModal();
            this.renderWeeklyPlan();
            this.updateStats();
        }
    }

    updateStats() {
        document.getElementById('total-workouts').textContent = this.workouts.length;
        
        const totalExercises = this.workouts.reduce((total, workout) => total + workout.exercises.length, 0);
        document.getElementById('total-exercises').textContent = totalExercises;
        
        const totalTime = this.workouts.reduce((total, workout) => total + workout.duration, 0);
        document.getElementById('total-time').textContent = totalTime;
        
        const muscleGroupCount = {};
        this.workouts.forEach(workout => {
            workout.muscleGroups.forEach(group => {
                muscleGroupCount[group] = (muscleGroupCount[group] || 0) + 1;
            });
        });
        
        const mostTrained = Object.keys(muscleGroupCount).length > 0 
            ? Object.keys(muscleGroupCount).reduce((a, b) => muscleGroupCount[a] > muscleGroupCount[b] ? a : b)
            : '-';
            
        document.getElementById('most-trained').textContent = mostTrained;
    }

    updateCharts() {
        this.createMuscleChart();
        this.createWeekChart();
    }

    createMuscleChart() {
        const canvas = document.getElementById('muscleChart');
        const ctx = canvas.getContext('2d');
        
        const muscleGroupCount = {};
        this.workouts.forEach(workout => {
            workout.muscleGroups.forEach(group => {
                muscleGroupCount[group] = (muscleGroupCount[group] || 0) + 1;
            });
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (Object.keys(muscleGroupCount).length === 0) {
            ctx.fillStyle = '#718096';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Brak danych', canvas.width / 2, canvas.height / 2);
            return;
        }

        const sortedMuscles = Object.entries(muscleGroupCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        const maxCount = Math.max(...sortedMuscles.map(([,count]) => count));
        const colors = ['#667eea', '#764ba2', '#4facfe', '#00f2fe', '#43e97b'];
        
        const barWidth = (canvas.width - 40) / sortedMuscles.length;
        const barMaxHeight = canvas.height - 60;

        sortedMuscles.forEach(([muscle, count], index) => {
            const barHeight = (count / maxCount) * barMaxHeight;
            const x = 20 + index * barWidth;
            const y = canvas.height - 40 - barHeight;

            ctx.fillStyle = colors[index];
            ctx.fillRect(x + 5, y, barWidth - 10, barHeight);

            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(count.toString(), x + barWidth/2, y - 5);

            ctx.save();
            ctx.translate(x + barWidth/2, canvas.height - 10);
            ctx.rotate(-Math.PI / 6);
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(muscle.substring(0, 8), 0, 0);
            ctx.restore();
        });
    }

    createWeekChart() {
        const canvas = document.getElementById('weekChart');
        const ctx = canvas.getContext('2d');
        
        const days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
        const dayCount = {};
        
        days.forEach(day => {
            dayCount[day] = this.workouts.filter(workout => workout.day === day).length;
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const maxCount = Math.max(...Object.values(dayCount), 1);
        const colors = ['#667eea', '#764ba2', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7', '#fc8181'];
        
        const barWidth = (canvas.width - 40) / days.length;
        const barMaxHeight = canvas.height - 60;

        days.forEach((day, index) => {
            const count = dayCount[day];
            const barHeight = (count / maxCount) * barMaxHeight;
            const x = 20 + index * barWidth;
            const y = canvas.height - 40 - barHeight;

            ctx.fillStyle = colors[index];
            ctx.fillRect(x + 2, y, barWidth - 4, barHeight);

            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            if (count > 0) {
                ctx.fillText(count.toString(), x + barWidth/2, y - 5);
            }

            ctx.font = '10px Arial';
            ctx.fillText(day.substring(0, 3), x + barWidth/2, canvas.height - 5);
        });
    }

    saveToStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.workouts));
        localStorage.setItem('completedWorkouts', JSON.stringify(this.completedWorkouts));
        localStorage.setItem('dailyTasks', JSON.stringify(this.dailyTasks));
        localStorage.setItem('customTasks', JSON.stringify(this.customTasks));
        localStorage.setItem('goals', this.goals);
        localStorage.setItem('measurements', JSON.stringify(this.measurements));
        localStorage.setItem('weightGoal', this.weightGoal || '');
    }

    // === CALENDAR METHODS ===
    initCalendar() {
        this.renderCalendar();
        this.renderWorkoutHistory();
    }

    renderCalendar() {
        const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
                           'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
        
        const currentMonthEl = document.getElementById('current-month');
        if (currentMonthEl) {
            currentMonthEl.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        }

        const calendarGrid = document.getElementById('calendar-grid');
        if (!calendarGrid) return;

        calendarGrid.innerHTML = '';

        const dayHeaders = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-header-day';
            header.textContent = day;
            header.style.cssText = `
                text-align: center;
                font-weight: bold;
                padding: 10px;
                color: #4a5568;
                background: #e2e8f0;
                border-radius: 6px;
            `;
            calendarGrid.appendChild(header);
        });

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const today = new Date();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const startDate = new Date(firstDay);
        const dayOfWeek = firstDay.getDay();
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate.setDate(firstDay.getDate() - daysToSubtract);

        for (let i = 0; i < 42; i++) {
            const currentDay = new Date(startDate);
            currentDay.setDate(startDate.getDate() + i);
            
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            
            if (currentDay.getMonth() !== month) {
                dayEl.classList.add('other-month');
            }
            
            if (currentDay.toDateString() === today.toDateString()) {
                dayEl.classList.add('today');
            }
            
            const dayWorkouts = this.getWorkoutsForDate(currentDay);
            const hasCompletedWorkout = this.isWorkoutCompleted(currentDay);
            
            if (dayWorkouts.length > 0) {
                dayEl.classList.add('has-workout');
                if (hasCompletedWorkout) {
                    dayEl.classList.add('completed');
                }
            }

            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = currentDay.getDate();
            dayEl.appendChild(dayNumber);

            dayWorkouts.slice(0, 2).forEach(workout => {
                const indicator = document.createElement('div');
                indicator.className = 'workout-indicator';
                indicator.textContent = workout.name.substring(0, 8) + '...';
                dayEl.appendChild(indicator);
            });

            if (hasCompletedWorkout) {
                const completedEl = document.createElement('div');
                completedEl.className = 'completed-indicator';
                completedEl.textContent = '✓';
                dayEl.appendChild(completedEl);
            }

            dayEl.addEventListener('click', () => {
                this.onDayClick(currentDay, dayWorkouts);
            });

            calendarGrid.appendChild(dayEl);
        }
    }

    getWorkoutsForDate(date) {
        const dayName = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'][date.getDay()];
        return this.workouts.filter(workout => workout.day === dayName);
    }

    isWorkoutCompleted(date) {
        const dateStr = date.toISOString().split('T')[0];
        return this.completedWorkouts.includes(dateStr);
    }

    onDayClick(date, workouts) {
        const dateStr = date.toISOString().split('T')[0];
        
        if (workouts.length === 0) {
            alert('Brak treningów na ten dzień!');
            return;
        }

        const isCompleted = this.isWorkoutCompleted(date);
        const action = isCompleted ? 'oznacz jako nieukończony' : 'oznacz jako ukończony';
        
        if (confirm(`Dzień: ${date.toLocaleDateString('pl-PL')}\nTreningi: ${workouts.map(w => w.name).join(', ')}\n\nCzy chcesz ${action}?`)) {
            if (isCompleted) {
                this.completedWorkouts = this.completedWorkouts.filter(d => d !== dateStr);
            } else {
                this.completedWorkouts.push(dateStr);
            }
            this.saveToStorage();
            this.renderCalendar();
            this.renderWorkoutHistory();
        }
    }

    // === DAILY TASKS METHODS ===
    initDailyTasks() {
        this.renderDailyTasks();
        this.bindTaskEvents();
    }

    renderDailyTasks() {
        const today = new Date().toISOString().split('T')[0];
        const todayTasks = this.dailyTasks[today] || {};

        ['water-task', 'steps-task', 'protein-task', 'sleep-task'].forEach(taskId => {
            const checkbox = document.getElementById(taskId);
            if (checkbox) {
                checkbox.checked = todayTasks[taskId] || false;
            }
        });

        this.renderCustomTasks();
    }

    renderCustomTasks() {
        const container = document.getElementById('daily-tasks');
        if (!container) return;

        container.querySelectorAll('.custom-task').forEach(el => el.remove());

        this.customTasks.forEach((task, index) => {
            const taskEl = document.createElement('div');
            taskEl.className = 'task-item custom-task';
            
            const today = new Date().toISOString().split('T')[0];
            const isChecked = this.dailyTasks[today] && this.dailyTasks[today][`custom-${index}`];
            
            taskEl.innerHTML = `
                <input type="checkbox" id="custom-${index}" ${isChecked ? 'checked' : ''}>
                <label for="custom-${index}">${task}</label>
                <button class="delete-custom-task" data-index="${index}" style="margin-left: auto; background: #f56565; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">❌</button>
            `;
            
            container.appendChild(taskEl);
        });

        this.bindTaskEvents();
    }

    bindTaskEvents() {
        document.querySelectorAll('#daily-tasks input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateTaskStatus(e.target.id, e.target.checked);
            });
        });

        document.querySelectorAll('.delete-custom-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.deleteCustomTask(index);
            });
        });
    }

    updateTaskStatus(taskId, checked) {
        const today = new Date().toISOString().split('T')[0];
        if (!this.dailyTasks[today]) {
            this.dailyTasks[today] = {};
        }
        this.dailyTasks[today][taskId] = checked;
        this.saveToStorage();
    }

    addCustomTask() {
        const input = document.getElementById('custom-task-input');
        if (!input || !input.value.trim()) return;

        this.customTasks.push(input.value.trim());
        input.value = '';
        this.saveToStorage();
        this.renderCustomTasks();
    }

    deleteCustomTask(index) {
        if (confirm('Czy chcesz usunąć to zadanie?')) {
            this.customTasks.splice(index, 1);
            this.saveToStorage();
            this.renderCustomTasks();
        }
    }

    // === WORKOUT HISTORY METHODS ===
    renderWorkoutHistory() {
        const container = document.getElementById('workout-history-list');
        if (!container) return;

        container.innerHTML = '';
        
        const recentWorkouts = this.completedWorkouts
            .slice(-10)
            .reverse()
            .map(dateStr => {
                const date = new Date(dateStr);
                const dayWorkouts = this.getWorkoutsForDate(date);
                return { date, workouts: dayWorkouts };
            });

        if (recentWorkouts.length === 0) {
            container.innerHTML = '<p style="color: #718096; font-style: italic; text-align: center;">Brak ukończonych treningów</p>';
            return;
        }

        recentWorkouts.forEach(({ date, workouts }) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'workout-history-item';
            
            historyItem.innerHTML = `
                <div class="workout-date">${date.toLocaleDateString('pl-PL')}</div>
                <div class="workout-name">${workouts.map(w => w.name).join(', ')}</div>
                <div class="workout-details">${workouts.reduce((total, w) => total + w.duration, 0)} min • ${workouts.reduce((total, w) => total + w.exercises.length, 0)} ćwiczeń</div>
            `;
            
            container.appendChild(historyItem);
        });
    }

    // === GOALS METHODS ===
    loadGoals() {
        const textarea = document.getElementById('goals-textarea');
        if (textarea) {
            textarea.value = this.goals;
        }
    }

    saveGoals() {
        const textarea = document.getElementById('goals-textarea');
        if (textarea) {
            this.goals = textarea.value;
            this.saveToStorage();
            alert('Cele zostały zapisane! 🎯');
        }
    }

    // === BODY MEASUREMENTS METHODS ===
    initBodyStats() {
        this.renderBodyStats();
        this.updateWeightChart();
        
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('measurement-date');
        if (dateInput) {
            dateInput.value = today;
        }
        
        const addMeasurementBtn = document.getElementById('add-measurement-btn');
        if (addMeasurementBtn) {
            addMeasurementBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addMeasurement();
            });
        }
    }

    addMeasurement() {
        const weight = parseFloat(document.getElementById('weight-input').value);
        const height = parseInt(document.getElementById('height-input').value);
        const bodyFat = parseFloat(document.getElementById('body-fat-input').value) || null;
        const date = document.getElementById('measurement-date').value;

        if (!weight || !height || !date) {
            alert('Podaj wagę, wzrost i datę!');
            return;
        }

        const measurement = {
            id: Date.now(),
            weight,
            height,
            bodyFat,
            date,
            bmi: this.calculateBMI(weight, height),
            createdAt: new Date().toISOString()
        };

        this.measurements.push(measurement);
        this.measurements.sort((a, b) => new Date(a.date) - new Date(b.date));
        this.saveToStorage();
        
        document.getElementById('measurement-form').reset();
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('measurement-date').value = today;
        
        this.renderBodyStats();
        this.updateWeightChart();
        
        alert('Pomiar został dodany! 📊');
    }

    calculateBMI(weight, height) {
        const heightInMeters = height / 100;
        return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
    }

    getBMICategory(bmi) {
        if (bmi < 18.5) return { text: 'Niedowaga', color: '#4299e1' };
        if (bmi < 25) return { text: 'Prawidłowa waga', color: '#48bb78' };
        if (bmi < 30) return { text: 'Nadwaga', color: '#ed8936' };
        return { text: 'Otyłość', color: '#f56565' };
    }

    renderBodyStats() {
        const currentBMI = document.getElementById('current-bmi');
        const bmiCategory = document.getElementById('bmi-category');
        const measurementsList = document.getElementById('measurements-list');

        if (this.measurements.length === 0) {
            if (currentBMI) currentBMI.textContent = '-';
            if (bmiCategory) bmiCategory.textContent = 'Brak danych';
            if (measurementsList) {
                measurementsList.innerHTML = '<p style="color: #718096; font-style: italic; text-align: center;">Brak pomiarów</p>';
            }
            return;
        }

        const latest = this.measurements[this.measurements.length - 1];
        const category = this.getBMICategory(latest.bmi);

        if (currentBMI) {
            currentBMI.textContent = latest.bmi;
            currentBMI.style.color = category.color;
        }
        
        if (bmiCategory) {
            bmiCategory.textContent = category.text;
            bmiCategory.style.backgroundColor = category.color + '20';
            bmiCategory.style.color = category.color;
        }

        if (measurementsList) {
            measurementsList.innerHTML = '';
            
            this.measurements.slice(-10).reverse().forEach(measurement => {
                const item = document.createElement('div');
                item.className = 'measurement-item';
                
                const weightChange = this.getWeightChange(measurement);
                const changeText = weightChange !== null ? 
                    (weightChange > 0 ? `+${weightChange}kg` : `${weightChange}kg`) : '';
                
                item.innerHTML = `
                    <div class="measurement-date">${new Date(measurement.date).toLocaleDateString('pl-PL')}</div>
                    <div class="measurement-details">
                        <span>Waga: <strong>${measurement.weight}kg</strong></span>
                        <span>Wzrost: <strong>${measurement.height}cm</strong></span>
                        <span class="measurement-bmi">BMI: ${measurement.bmi}</span>
                        ${measurement.bodyFat ? `<span>Tłuszcz: <strong>${measurement.bodyFat}%</strong></span>` : ''}
                        ${changeText ? `<span style="color: ${weightChange > 0 ? '#f56565' : '#48bb78'}">${changeText}</span>` : ''}
                    </div>
                    <button class="delete-measurement" onclick="planner.deleteMeasurement(${measurement.id})">❌</button>
                `;
                
                measurementsList.appendChild(item);
            });
        }

        this.updateWeightGoal();
    }

    getWeightChange(measurement) {
        const index = this.measurements.findIndex(m => m.id === measurement.id);
        if (index <= 0) return null;
        
        const previous = this.measurements[index - 1];
        return Math.round((measurement.weight - previous.weight) * 10) / 10;
    }

    deleteMeasurement(id) {
        if (confirm('Czy chcesz usunąć ten pomiar?')) {
            this.measurements = this.measurements.filter(m => m.id !== id);
            this.saveToStorage();
            this.renderBodyStats();
            this.updateWeightChart();
        }
    }

    setWeightGoal() {
        const goalInput = document.getElementById('weight-goal-input');
        const goal = parseFloat(goalInput.value);
        
        if (!goal || goal <= 0) {
            alert('Podaj prawidłowy cel wagowy!');
            return;
        }

        this.weightGoal = goal;
        this.saveToStorage();
        this.updateWeightGoal();
        goalInput.value = '';
        
        alert('Cel wagowy został ustawiony! 🎯');
    }

    updateWeightGoal() {
        const goalProgress = document.getElementById('goal-progress');
        const goalWeight = document.getElementById('goal-weight');
        const weightRemaining = document.getElementById('weight-remaining');
        const progressFill = document.getElementById('progress-fill');

        if (!this.weightGoal || this.measurements.length === 0) {
            if (goalProgress) goalProgress.style.display = 'none';
            return;
        }

        const currentWeight = this.measurements[this.measurements.length - 1].weight;
        const startWeight = this.measurements[0].weight;
        const remaining = Math.round((currentWeight - this.weightGoal) * 10) / 10;
        const totalChange = startWeight - this.weightGoal;
        const currentChange = startWeight - currentWeight;
        const progress = totalChange !== 0 ? Math.min(100, Math.max(0, (currentChange / totalChange) * 100)) : 0;

        if (goalProgress) goalProgress.style.display = 'block';
        if (goalWeight) goalWeight.textContent = this.weightGoal;
        if (weightRemaining) {
            weightRemaining.textContent = Math.abs(remaining);
            weightRemaining.style.color = remaining <= 0 ? '#48bb78' : '#f56565';
        }
        if (progressFill) progressFill.style.width = progress + '%';
    }

    updateWeightChart() {
        const canvas = document.getElementById('weightChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.measurements.length === 0) {
            ctx.fillStyle = '#718096';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Brak danych do wyświetlenia', canvas.width / 2, canvas.height / 2);
            return;
        }

        const data = this.measurements.slice(-20);
        const weights = data.map(m => m.weight);
        const minWeight = Math.min(...weights) - 2;
        const maxWeight = Math.max(...weights) + 2;
        const weightRange = maxWeight - minWeight;

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;

        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();

        data.forEach((measurement, index) => {
            const x = 50 + (index / (data.length - 1)) * (canvas.width - 100);
            const y = canvas.height - 50 - ((measurement.weight - minWeight) / weightRange) * (canvas.height - 100);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        ctx.stroke();

        if (this.weightGoal && this.weightGoal >= minWeight && this.weightGoal <= maxWeight) {
            const goalY = canvas.height - 50 - ((this.weightGoal - minWeight) / weightRange) * (canvas.height - 100);
            ctx.strokeStyle = '#ed8936';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(50, goalY);
            ctx.lineTo(canvas.width - 50, goalY);
            ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.fillStyle = '#ed8936';
            ctx.font = '12px Arial';
            ctx.fillText(`Cel: ${this.weightGoal}kg`, canvas.width - 100, goalY - 10);
        }

        ctx.fillStyle = '#4a5568';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const weight = minWeight + (weightRange * i / 5);
            const y = canvas.height - 50 - (i * (canvas.height - 100) / 5);
            ctx.fillText(weight.toFixed(1) + 'kg', 45, y + 3);
        }

        ctx.textAlign = 'center';
        data.forEach((measurement, index) => {
            if (index % Math.ceil(data.length / 5) === 0) {
                const x = 50 + (index / (data.length - 1)) * (canvas.width - 100);
                const date = new Date(measurement.date);
                ctx.fillText(
                    date.getDate() + '/' + (date.getMonth() + 1),
                    x,
                    canvas.height - 30
                );
            }
        });
    }

    exportData() {
        const dataStr = JSON.stringify(this.workouts, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `plan-treningowy-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    importData(jsonString) {
        try {
            const importedWorkouts = JSON.parse(jsonString);
            this.workouts = importedWorkouts;
            this.saveToStorage();
            this.renderWeeklyPlan();
            this.updateStats();
            alert('Plan treningowy został zaimportowany pomyślnie!');
        } catch (error) {
            alert('Błąd podczas importowania planu. Sprawdź format pliku.');
        }
    }

    clearAllData() {
        if (confirm('Czy na pewno chcesz usunąć wszystkie treningi? Ta operacja jest nieodwracalna.')) {
            this.workouts = [];
            this.currentWorkout = null;
            this.saveToStorage();
            this.renderWeeklyPlan();
            this.updateStats();
            document.getElementById('exercises-panel').style.display = 'none';
            alert('Wszystkie dane zostały usunięte.');
        }
    }

    generateSamplePlan() {
        const sampleWorkouts = [
            {
                id: Date.now() + 1,
                name: "Push - Klatka, Ramiona, Triceps",
                day: "Poniedziałek",
                muscleGroups: ["Klatka piersiowa", "Ramiona", "Triceps"],
                duration: 75,
                exercises: [
                    { id: 1, name: "Wyciskanie sztangi na ławce", sets: 4, reps: "8-10", weight: "80", notes: "Kontrolowane opuszczanie" },
                    { id: 2, name: "Wyciskanie hantli na ławce skośnej", sets: 3, reps: "10-12", weight: "30", notes: "" },
                    { id: 3, name: "Pompki na poręczach", sets: 3, reps: "12-15", weight: "", notes: "Do odmowy" },
                    { id: 4, name: "Wyciskanie żołnierskie", sets: 4, reps: "8-10", weight: "50", notes: "" },
                    { id: 5, name: "Wznosy bokiem", sets: 3, reps: "12-15", weight: "12", notes: "" },
                    { id: 6, name: "Prostowanie ramion na wyciągu", sets: 3, reps: "12-15", weight: "40", notes: "" }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 2,
                name: "Pull - Plecy, Biceps",
                day: "Wtorek",
                muscleGroups: ["Plecy", "Biceps"],
                duration: 70,
                exercises: [
                    { id: 7, name: "Podciąganie na drążku", sets: 4, reps: "6-8", weight: "", notes: "Szerokim chwytem" },
                    { id: 8, name: "Wiosłowanie sztangą", sets: 4, reps: "8-10", weight: "70", notes: "Zgięcie w biodrach" },
                    { id: 9, name: "Wiosłowanie hantlem", sets: 3, reps: "10-12", weight: "35", notes: "Każda ręka osobno" },
                    { id: 10, name: "Ściąganie drążka", sets: 3, reps: "10-12", weight: "60", notes: "" },
                    { id: 11, name: "Uginanie ramion ze sztangą", sets: 4, reps: "10-12", weight: "40", notes: "" },
                    { id: 12, name: "Uginanie ramion z hantlami", sets: 3, reps: "12-15", weight: "16", notes: "Naprzemiennie" }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 3,
                name: "Legs - Nogi, Pośladki",
                day: "Środa",
                muscleGroups: ["Nogi", "Pośladki", "Łydki"],
                duration: 80,
                exercises: [
                    { id: 13, name: "Przysiad ze sztangą", sets: 4, reps: "8-10", weight: "100", notes: "Pełny zakres ruchu" },
                    { id: 14, name: "Martwy ciąg rumuński", sets: 4, reps: "10-12", weight: "80", notes: "Kontrola w fazie negatywnej" },
                    { id: 15, name: "Wykroki z hantlami", sets: 3, reps: "12 każda noga", weight: "20", notes: "" },
                    { id: 16, name: "Prostowanie nóg", sets: 3, reps: "12-15", weight: "50", notes: "" },
                    { id: 17, name: "Uginanie nóg", sets: 3, reps: "12-15", weight: "45", notes: "" },
                    { id: 18, name: "Wspięcia na palce", sets: 4, reps: "15-20", weight: "60", notes: "Pełny zakres ruchu" }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 4,
                name: "Upper Body - Góra ciała",
                day: "Piątek",
                muscleGroups: ["Klatka piersiowa", "Plecy", "Ramiona"],
                duration: 65,
                exercises: [
                    { id: 19, name: "Wyciskanie hantli płasko", sets: 3, reps: "10-12", weight: "32", notes: "" },
                    { id: 20, name: "Wiosłowanie na wyciągu dolnym", sets: 3, reps: "10-12", weight: "65", notes: "" },
                    { id: 21, name: "Wyciskanie hantli nad głowę", sets: 3, reps: "10-12", weight: "24", notes: "" },
                    { id: 22, name: "Rozpiętki na ławce", sets: 3, reps: "12-15", weight: "18", notes: "Kontrolowane opuszczanie" },
                    { id: 23, name: "Wznosy tyłem", sets: 3, reps: "12-15", weight: "10", notes: "" },
                    { id: 24, name: "Planki", sets: 3, reps: "30-45 sek", weight: "", notes: "Napięty brzuch" }
                ],
                createdAt: new Date().toISOString()
            }
        ];

        if (confirm('Czy chcesz wygenerować przykładowy plan treningowy? Spowoduje to usunięcie aktualnych danych.')) {
            this.workouts = sampleWorkouts;
            this.saveToStorage();
            this.renderWeeklyPlan();
            this.updateStats();
            alert('Przykładowy plan treningowy został wygenerowany! 🏋️‍♂️');
        }
    }
}

function addImportFileListener() {
    document.getElementById('import-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                planner.importData(e.target.result);
            };
            reader.readAsText(file);
        }
    });
}

let planner;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing planner...');
    planner = new WorkoutPlanner();
    addImportFileListener();
    
    addHelpTooltips();
    
    console.log('Planner initialized');
});

function addHelpTooltips() {
    const helpIcon = document.createElement('span');
    helpIcon.innerHTML = ' ℹ️';
    helpIcon.style.cursor = 'help';
    helpIcon.title = 'Wypełnij formularz aby stworzyć nowy trening. Następnie dodaj ćwiczenia do swojego planu.';
    
    const firstH2 = document.querySelector('.add-workout-panel h2');
    firstH2.appendChild(helpIcon);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        planner.closeModal();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        planner.exportData();
    }
});

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
        background: ${type === 'success' ? '#48bb78' : '#f56565'};
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const originalAlert = window.alert;
window.alert = function(message) {
    if (message.includes('💪') || message.includes('🏋️‍♂️')) {
        showNotification(message, 'success');
    } else {
        originalAlert(message);
    }
};
