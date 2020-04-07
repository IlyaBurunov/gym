import { Observable, of } from 'rxjs';
import { exercises, ExerciseDatabaseType } from '../database/exercises';

export class SearchService {
  searchExercises(query: string, limit = 10): Observable<ExerciseDatabaseType[]> {
    const searchResults = exercises.filter(e => e.name.includes(query.toLowerCase()));

    if (searchResults.length < limit) {
      return of(searchResults);
    }

    return of(searchResults.slice(limit));
  }
}
