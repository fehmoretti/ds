// Global services barrel
export { supabase } from '@/lib/supabase';
export {
  fetchUserProjects,
  fetchProject,
  createProject,
  updateProject,
  deleteProject,
  fetchProjectMembers,
  addProjectMember,
  removeProjectMember,
  saveProjectTokens,
} from './projects.service';
export type { Project, ProjectInsert, ProjectUpdate, ProjectMember } from './projects.service';
