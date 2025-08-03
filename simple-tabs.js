
class SimpleWorkoutPlanner {
    constructor() {
        this.workouts = JSON.parse(localStorage.getItem('workouts')) || [];
        this.currentWorkout = null;
        this.currentTab = 'add-workout';
    }

    init() {
        this.bindEvents();
        this.renderWeeklyPlan();
        this.updateStats();
        this.initTabs();
    }

    bindEvents() {
        // Form dodawania treningu
        const workoutForm = document.getElementById('workout-form');
        if (workoutForm) {
            workoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addWorkout();
            });
        }

        // Form dodawania ćwiczeń
        const exerciseForm = document.getElementById('exercise-form');
        if (exerciseForm) {
            exerciseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addExercise();
            });
        }

        // Przycisk zakończenia treningu
        const finishBtn = document.getElementById('finish-workout');
        if (finishBtn) {
            finishBtn.addEventListener('click', () => {
                this.finishWorkout();
            });
        }
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
            if (!dayColumn) return;
            
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
                    dayColumn.appendChild(workoutCard);
                });
            }
        });
    }

    updateStats() {
        const totalWorkoutsEl = document.getElementById('total-workouts');
        const totalExercisesEl = document.getElementById('total-exercises');
        const totalTimeEl = document.getElementById('total-time');
        const mostTrainedEl = document.getElementById('most-trained');

        if (totalWorkoutsEl) totalWorkoutsEl.textContent = this.workouts.length;
        
        const totalExercises = this.workouts.reduce((total, workout) => total + workout.exercises.length, 0);
        if (totalExercisesEl) totalExercisesEl.textContent = totalExercises;
        
        const totalTime = this.workouts.reduce((total, workout) => total + workout.duration, 0);
        if (totalTimeEl) totalTimeEl.textContent = totalTime;
        
        const muscleGroupCount = {};
        this.workouts.forEach(workout => {
            workout.muscleGroups.forEach(group => {
                muscleGroupCount[group] = (muscleGroupCount[group] || 0) + 1;
            });
        });
        
        const mostTrained = Object.keys(muscleGroupCount).length > 0 
            ? Object.keys(muscleGroupCount).reduce((a, b) => muscleGroupCount[a] > muscleGroupCount[b] ? a : b)
            : '-';
            
        if (mostTrainedEl) mostTrainedEl.textContent = mostTrained;
    }

    saveToStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.workouts));
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
                    { id: 2, name: "Wyciskanie hantli na ławce skośnej", sets: 3, reps: "10-12", weight: "30", notes: "" }
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

function initSimpleTabs() {
    console.log('Initializing simple tabs system...');
    
    // Ukrwa wszystkie zakładki
    const allTabs = document.querySelectorAll('.tab-content');
    console.log('Found tabs:', allTabs.length);
    allTabs.forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });
    
    const firstTab = document.getElementById('add-workout-tab');
    if (firstTab) {
        firstTab.style.display = 'block';
        firstTab.classList.add('active');
        console.log('First tab shown');
    }
    
    const allBtns = document.querySelectorAll('.tab-btn');
    console.log('Found buttons:', allBtns.length);
    allBtns.forEach(btn => btn.classList.remove('active'));
    
    const firstBtn = document.querySelector('[data-tab="add-workout"]');
    if (firstBtn) {
        firstBtn.classList.add('active');
        console.log('First button activated');
    }
    
    allBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.dataset.tab;
            console.log('Tab clicked:', tabName);
            
            if (!tabName) return;
            
            allTabs.forEach(tab => {
                tab.style.display = 'none';
                tab.classList.remove('active');
            });
            
            allBtns.forEach(b => b.classList.remove('active'));
            
            const targetTab = document.getElementById(tabName + '-tab');
            if (targetTab) {
                targetTab.style.display = 'block';
                targetTab.classList.add('active');
                console.log('Tab switched to:', tabName);
            }
            
            this.classList.add('active');
            
            document.body.className = `tab-${tabName}`;
            console.log('Body class set to:', `tab-${tabName}`);
            
            console.log('Switched to tab:', tabName);
        });
    });
    
    document.body.className = 'tab-add-workout';
    console.log('Initial body class set to: tab-add-workout');
    
    console.log('Simple tabs initialized');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - starting simple tabs...');
    
    initSimpleTabs();
    
    console.log('Simple tabs system loaded');
});
