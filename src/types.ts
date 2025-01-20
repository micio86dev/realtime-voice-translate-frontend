export interface InputTextProps {
  id?: string;
  label?: string;
  name: string;
  placeholder?: string;
  class?: string;
  bClass?: string;
  type?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  value?: any;
  required?: boolean;
  onInput?: any;
}

export interface InputSelectProps {
  id?: string;
  label?: string;
  name: string;
  placeholder?: string;
  class?: string;
  type?: string;
  selected?: string;
  required?: boolean;
  options?: any[];
  onInput?: any;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  roleId: string;
  createdAt: Date;
}

export interface ExerciseGroup {
  id: string;
  name: any;
  imageUrl?: string;
  sort?: number;
}

export interface CommonExercise {
  id: string;
  name: any;
  description?: any;
  videoUrl?: string;
  imageUrl?: string;
  sort?: number;
  groupId: string;
  group: ExerciseGroup;
}

export interface Exercise {
  id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  goals: Goal[];
  sort?: number;
  numberOfSets: number;
  groupId: string;
  group: ExerciseGroup;
  commonExerciseId?: string;
}

export interface ExerciseRep {
  id?: string;
  reps?: number;
  weight?: number;
  exerciseId: string;
  exercise: Exercise;
  workoutId?: string;
  workout?: Workout;
}

export interface Day {
  id: string;
  name: string;
  exercises?: Exercise[];
  sort?: number;
}

export interface Card {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId?: string;
  name: string;
  groupId: string;
  selected: boolean;
  sort: number;
  days?: Day[];
}

export interface GoalRep {
  id: string;
  weight?: number;
  reps?: number;
  goalId: string;
  goal: Goal;
}

export interface Goal {
  id: string;
  createdAt: Date;
  sets: GoalRep[];
  exerciseId: string;
  exercise?: Exercise;
}

export interface Workout {
  id: string;
  endedAt?: Date;
  userId: string;
  dayId: string;
  day?: Day;
  user: User;
  sets?: ExerciseRep[];
  checked?: boolean;
}

export interface Text {
  id: string;
  name: string;
  text: string;
}

export interface MsgErrors {
  errors?: any,
  msg?: {
    class: string;
    text: string;
  };
}

export interface Lang {
  id: string;
  name: string;
  lang: string;
}

export interface Voice {
  id: string;
  name: string;
  localService: boolean;
  lang: string;
}

export interface Phrase {
  id: string;
  text: string;
  isFinal: boolean;
}

export interface Member {
  id: string;
  name: string;
  lang: string;
  info?: any;
}

export interface Members {
  members: any;
}

export interface Message {
  id: string;
  text: string;
  channelId: string;
  user_id: string;
  message: string;
}