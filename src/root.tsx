import {
  component$,
  useStyles$,
  createContextId,
  useContextProvider,
  useStore,
  getLocale,
  $,
  useOnDocument,
} from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import Cookies from "js-cookie";
import ajax from "~/utils/ajax";
import type { Role, User, Card, Day, ExerciseGroup, CommonExercise, Exercise, Goal, Workout } from "~/types";
import { RouterHead } from "./components/router-head/router-head";

import globalStyles from "~/assets/styles/main.css?inline";

interface GlobalStore {
  percentage: number;
}

interface AuthStore {
  id?: string;
  email: string;
  name: string;
  surname: string;
  roleId: string;
  authToken?: string;
}

interface RoleStore {
  items: Role[];
}

interface UserStore {
  openedId?: string;
  openedAdd?: boolean;
  items: User[];
}

interface CardStore {
  openedId?: string;
  goalsId?: string;
  openedAdd?: boolean;
  items: Card[];
  currentCard?: Card;
}

interface DayStore {
  openedId?: string;
  items: Day[];
}

interface ExerciseGroupStore {
  openedId?: string;
  openedAdd?: boolean;
  items: ExerciseGroup[];
}

interface CommonExerciseStore {
  openedId?: string;
  openedAdd?: boolean;
  items: CommonExercise[];
  filteredItems: CommonExercise[];
}

interface ExerciseStore {
  openedId?: string;
  items: Exercise[];
}

interface GoalStore {
  openedId?: string;
  items: Goal[];
}

interface WorkoutStore {
  openedId?: string;
  items: Workout[];
}

export const GlobalContext = createContextId<GlobalStore>("global");
export const AuthContext = createContextId<AuthStore>("user-information");
export const RolesContext = createContextId<RoleStore>("role");
export const UsersContext = createContextId<UserStore>("user");
export const CardsContext = createContextId<CardStore>("card");
export const DaysContext = createContextId<DayStore>("day");
export const ExercisesGroupsContext = createContextId<ExerciseGroupStore>("exercise-group");
export const CommonsExercisesContext = createContextId<CommonExerciseStore>("common-exercise");
export const ExercisesContext = createContextId<ExerciseStore>("exercise");
export const GoalsContext = createContextId<GoalStore>("goal");
export const WorkoutsContext = createContextId<WorkoutStore>("workout");

export default component$(() => {
  useStyles$(globalStyles);
  const lang = getLocale();

  const globalStore: GlobalStore = useStore({
    percentage: 0,
  });

  const authStore: AuthStore = useStore({
    id: "",
    name: "",
    surname: "",
    email: "",
    roleId: "",
    authToken: undefined,
  });
  const roleStore: RoleStore = useStore({
    items: [] as Role[],
  });
  const userStore: UserStore = useStore({
    openedId: undefined,
    openedAdd: false,
    items: [] as User[],
  });
  const cardStore: CardStore = useStore({
    openedId: undefined,
    openedAdd: false,
    selectedCard: undefined,
    selected: false,
    items: [] as Card[],
  });
  const dayStore: DayStore = useStore({
    openedId: undefined,
    items: [] as Day[],
  });
  const exerciseGroupStore: ExerciseGroupStore = useStore({
    openedId: undefined,
    items: [] as ExerciseGroup[],
  });
  const commonExerciseStore: CommonExerciseStore = useStore({
    openedId: undefined,
    items: [] as CommonExercise[],
    filteredItems: [] as CommonExercise[],
  });
  const exerciseStore: ExerciseStore = useStore({
    openedId: undefined,
    items: [] as Exercise[],
  });
  const goalStore: GoalStore = useStore({
    openedId: undefined,
    items: [] as Goal[],
  });
  const workoutStore: WorkoutStore = useStore({
    openedId: undefined,
    items: [] as Workout[],
  });

  useContextProvider(GlobalContext, globalStore);
  useContextProvider(AuthContext, authStore);
  useContextProvider(RolesContext, roleStore);
  useContextProvider(UsersContext, userStore);
  useContextProvider(CardsContext, cardStore);
  useContextProvider(DaysContext, dayStore);
  useContextProvider(ExercisesGroupsContext, exerciseGroupStore);
  useContextProvider(CommonsExercisesContext, commonExerciseStore);
  useContextProvider(ExercisesContext, exerciseStore);
  useContextProvider(GoalsContext, goalStore);
  useContextProvider(WorkoutsContext, workoutStore);

  useOnDocument("qinit", $(() => {
    const route = window.location.pathname;
    globalStore.percentage = 0;

    if (Cookies.get("token")) {
      if ([`/${ lang }/login/`, `/${ lang }/signup/`, '/'].includes(route)) {
        window.location.href = `/${ lang }`;
      }

      // Load user data
      authStore.authToken = Cookies.get("token");

      ajax.get("auth/me").then((res: any) => {
        Object.assign(authStore, { ...res, authToken: Cookies.get("token") });

        // Load all resources from API
        const resources = [
          { path: 'roles', store: roleStore, translate: ['name'] },
          { path: 'goals', store: goalStore },
          { path: 'cards', store: cardStore },
          { path: 'exercises', store: exerciseStore },
          { path: 'exercises_groups', store: exerciseGroupStore },
          { path: 'commons_exercises', store: commonExerciseStore },
          { path: 'users', store: userStore },
          { path: 'workouts', store: workoutStore },
        ];

        let i = 0;
        resources.forEach(async (resource) => {
          await ajax.get(resource.path).then((res: any) => {
            if (resource.translate) {
              resource.store.items = res.map((item: any) => {
                const obj: any = {};
                Object.keys(item).forEach((key: string) => {
                  obj[key] = resource.translate.includes(key) ? JSON.parse(item[key])[lang] : item[key];
                })
                return obj;
              });
            } else {
              resource.store.items = res;
            }
            i++;
            globalStore.percentage = Math.round(i * 10000 / resources.length) / 100;
          }).catch((err: any) => {
            if (err.msg) {
              alert(err.msg);
            }
          });
        });
      })
        .catch(() => {
          globalStore.percentage = 100;
          window.location.href = `/${ lang }/login`;
        });
    } else {
      globalStore.percentage = 100;

      if (![`/${ lang }/login/`, `/${ lang }/signup/`].includes(route)) {
        window.location.href = `/${ lang }/login`;
      }
    }
  }));

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body lang={ lang }>
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
