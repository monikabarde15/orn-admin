import Dropdown from '../../components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';
import { IRootState } from '../../store';
import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconPlus from '../../components/Icon/IconPlus';
import IconPlusCircle from '../../components/Icon/IconPlusCircle';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconTag from '../../components/Icon/IconTag';
import IconCalendar from '../../components/Icon/IconCalendar';
import IconEdit from '../../components/Icon/IconEdit';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconX from '../../components/Icon/IconX';
import axios from 'axios';

const Scrumboard = () => {
    const dispatch = useDispatch();
    const [projectList, setProjectList] = useState<any>([]);
    const [loading, setLoading] = useState(false); // Add loading state
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    useEffect(() => {
        dispatch(setPageTitle('Scrumboard'));
        fetchProjects();
    }, []);

    // Enhanced fetchProjects function
    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://cybitbackend.onrender.com/api/projects');
            
            console.log('Raw API response:', res.data);
            
            // Fix projects that might have tasks without position
            const projectsWithSortedTasks = (res.data || []).map((project: any) => {
                const tasksWithPositions = (project.tasks || []).map((task: any, index: number) => {
                    // If task doesn't have position field, assign it based on current index
                    if (task.position === undefined || task.position === null) {
                        console.warn(`Task "${task.title}" missing position, assigning ${index}`);
                        task.position = index;
                        task.sortOrder = index;
                    }
                    return task;
                });
                
                // Sort by position
                const sortedTasks = tasksWithPositions.sort((a: any, b: any) => 
                    (a.position || 0) - (b.position || 0)
                );
                
                console.log(`Project "${project.title}" tasks with positions:`, 
                    sortedTasks.map((t: any) => ({ id: t.id, title: t.title, position: t.position }))
                );
                
                return {
                    ...project,
                    tasks: sortedTasks
                };
            });
            
            setProjectList(projectsWithSortedTasks);
        } catch (error) {
            console.error('Error fetching projects:', error);
            showMessage('Error loading projects', 'error');
        } finally {
            setLoading(false);
        }
    };

    const [params, setParams] = useState<any>({
        id: null,
        title: '',
    });

    const [paramsTask, setParamsTask] = useState<any>({
        projectId: null,
        id: null,
        title: '',
        description: '',
        tags: '',
        date: '',
    });

    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isAddProjectModal, setIsAddProjectModal] = useState(false);
    const [isAddTaskModal, setIsAddTaskModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const addEditProject = (project: any = null) => {
        setParams({
            id: null,
            title: '',
        });
        if (project) {
            let projectData = JSON.parse(JSON.stringify(project));
            setParams(projectData);
        }
        setIsAddProjectModal(true);
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    // Fixed saveProject function
    const saveProject = async (e: any) => {
        e.preventDefault();
        if (!params.title?.trim()) {
            showMessage('Title is required.', 'error');
            return;
        }

        if (loading) return;

        try {
            setLoading(true);
            if (params.id) {
                // Update project
                const res = await axios.put(`https://cybitbackend.onrender.com/api/projects/${params.id}`, { 
                    title: params.title.trim() 
                });
                
                // Update project list with sorted tasks
                setProjectList((prevList: any) => 
                    prevList.map((p: any) => 
                        p.id === params.id ? {
                            ...res.data,
                            tasks: (res.data.tasks || []).sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
                        } : p
                    )
                );
                showMessage('Project updated successfully.');
            } else {
                // Add new project
                const res = await axios.post('https://cybitbackend.onrender.com/api/projects', { 
                    title: params.title.trim() 
                });
                setProjectList((prevList: any) => [...prevList, res.data]);
                showMessage('Project added successfully.');
            }
            setIsAddProjectModal(false);
            setParams({ id: null, title: '' });
        } catch (error) {
            console.error('Error saving project:', error);
            showMessage('Error saving project', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fixed deleteProject function
    const deleteProject = async (project: any) => {
        if (loading) return;

        try {
            setLoading(true);
            await axios.delete(`https://cybitbackend.onrender.com/api/projects/${project.id}`);
            setProjectList((prevList: any) => prevList.filter((d: any) => d.id !== project.id));
            showMessage('Project deleted successfully.');
        } catch (error) {
            console.error('Error deleting project:', error);
            showMessage('Error deleting project', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fixed clearProjects function
    const clearProjects = async (project: any) => {
        if (loading) return;

        try {
            setLoading(true);
            await axios.put(`https://cybitbackend.onrender.com/api/projects/${project.id}`, { 
                title: project.title,
                tasks: [] 
            });
            setProjectList((prevList: any) => 
                prevList.map((p: any) => 
                    p.id === project.id ? { ...p, tasks: [] } : p
                )
            );
            showMessage('All tasks cleared successfully.');
        } catch (error) {
            console.error('Error clearing tasks:', error);
            showMessage('Error clearing tasks', 'error');
        } finally {
            setLoading(false);
        }
    };

    const addTaskData = (e: any) => {
        const { value, id } = e.target;
        setParamsTask({ ...paramsTask, [id]: value });
    };

    const addEditTask = (projectId: any, task: any = null) => {
        setParamsTask({
            projectId: projectId,
            id: null,
            title: '',
            description: '',
            tags: '',
            date: '',
        });
        if (task) {
            let data = JSON.parse(JSON.stringify(task));
            data.projectId = projectId;
            data.tags = data.tags ? (Array.isArray(data.tags) ? data.tags.join(', ') : data.tags.toString()) : '';
            setParamsTask(data);
        }
        setIsAddTaskModal(true);
    };

    // Fixed saveTask function
    const saveTask = async (e: any) => {
        e.preventDefault();
        if (!paramsTask.title?.trim()) {
            showMessage('Title is required.', 'error');
            return;
        }

        if (loading) return;

        try {
            setLoading(true);
            const taskData = {
                title: paramsTask.title.trim(),
                description: paramsTask.description?.trim() || '',
                tags: paramsTask.tags?.trim() || ''
            };

            if (paramsTask.id) {
                // Update task
                const res = await axios.put(`https://cybitbackend.onrender.com/api/projects/${paramsTask.projectId}/tasks/${paramsTask.id}`, taskData);
                setProjectList((prevList: any) => 
                    prevList.map((p: any) => 
                        p.id === paramsTask.projectId ? {
                            ...res.data,
                            tasks: (res.data.tasks || []).sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
                        } : p
                    )
                );
                showMessage('Task updated successfully.');
            } else {
                // Add new task
                const res = await axios.post(`https://cybitbackend.onrender.com/api/projects/${paramsTask.projectId}/tasks`, taskData);
                setProjectList((prevList: any) => 
                    prevList.map((p: any) => 
                        p.id === paramsTask.projectId ? {
                            ...res.data,
                            tasks: (res.data.tasks || []).sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
                        } : p
                    )
                );
                showMessage('Task added successfully.');
            }
            setIsAddTaskModal(false);
            setParamsTask({
                projectId: null,
                id: null,
                title: '',
                description: '',
                tags: '',
                date: '',
            });
        } catch (error) {
            console.error('Error saving task:', error);
            showMessage('Error saving task', 'error');
        } finally {
            setLoading(false);
        }
    };

    const deleteConfirmModal = (projectId: any, task: any = null) => {
        setSelectedTask({ ...task, projectId });
        setIsDeleteModal(true);
    };

    // Fixed deleteTask function
    const deleteTask = async () => {
        if (loading) return;

        try {
            setLoading(true);
            // Fixed API endpoint - was missing https://cybitbackend.onrender.com/
            const res = await axios.delete(`https://cybitbackend.onrender.com/api/projects/${selectedTask.projectId}/tasks/${selectedTask.id}`);
            setProjectList((prevList: any) => 
                prevList.map((p: any) => 
                    p.id === selectedTask.projectId ? {
                        ...res.data,
                        tasks: (res.data.tasks || []).sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
                    } : p
                )
            );
            showMessage('Task deleted successfully.');
            setIsDeleteModal(false);
            setSelectedTask(null);
        } catch (error) {
            console.error('Error deleting task:', error);
            showMessage('Error deleting task', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Enhanced updateTaskOrder function with position handling
    const updateTaskOrder = async (projectId: number, newTasks: any[]) => {
        try {
            const project = projectList.find((p: any) => p.id === projectId);
            if (!project) {
                console.error('Project not found:', projectId);
                return;
            }

            // Add position and sortOrder to all tasks
            const tasksWithPositions = newTasks.map((task, index) => ({
                ...task,
                position: index,
                sortOrder: index,
                projectId: projectId,
                updatedAt: new Date().toISOString()
            }));

            console.log('Updating task positions:', tasksWithPositions.map((t: any) => ({ 
                id: t.id, 
                title: t.title, 
                position: t.position 
            })));

            await axios.put(`https://cybitbackend.onrender.com/api/projects/${projectId}`, {
                title: project.title,
                tasks: tasksWithPositions
            });

            showMessage('Task positions saved successfully!');
        } catch (error) {
            console.error('Error updating task order:', error);
            showMessage('Error saving task positions', 'error');
            // Refresh from database if error occurs
            fetchProjects();
        }
    };

    // Enhanced drag and drop handler with cross-project support
    const handleSetList = (currentProjectId: number) => (newState: any[], sortable: any) => {
        if (!sortable || loading) return;

        console.log('Drag and drop triggered for project:', currentProjectId);
        console.log('New task order:', newState.map((t: any) => ({ id: t.id, title: t.title })));

        const targetProjectId = currentProjectId;

        setProjectList((prevList: any) => {
            const updatedList = [...prevList];
            
            // Track cross-project moves
            let movedTasks: any[] = [];
            let sourceProjectId: number | null = null;

            // Find tasks that were moved from other projects
            newState.forEach((task, index) => {
                if (task.projectId && task.projectId !== targetProjectId) {
                    movedTasks.push({ ...task, newPosition: index });
                    sourceProjectId = task.projectId;
                    console.log(`Task "${task.title}" moved from project ${task.projectId} to ${targetProjectId}`);
                }
            });

            // Update target project
            const targetProjectIndex = updatedList.findIndex((p: any) => p.id === targetProjectId);
            if (targetProjectIndex !== -1) {
                const tasksWithPositions = newState.map((task, index) => ({
                    ...task,
                    projectId: targetProjectId,
                    position: index,
                    sortOrder: index
                }));
                
                console.log(`Updated project ${targetProjectId} with tasks:`, tasksWithPositions.map((t: any) => ({ 
                    id: t.id, 
                    title: t.title, 
                    position: t.position 
                })));
                
                updatedList[targetProjectIndex] = {
                    ...updatedList[targetProjectIndex],
                    tasks: tasksWithPositions
                };
            }

            // Handle cross-project moves
            if (movedTasks.length > 0 && sourceProjectId && sourceProjectId !== targetProjectId) {
                const sourceProjectIndex = updatedList.findIndex((p: any) => p.id === sourceProjectId);
                if (sourceProjectIndex !== -1) {
                    // Remove moved tasks from source project
                    const remainingTasks = updatedList[sourceProjectIndex].tasks
                        .filter((task: any) => !movedTasks.some((movedTask: any) => movedTask.id === task.id))
                        .map((task: any, index: number) => ({
                            ...task,
                            position: index,
                            sortOrder: index
                        }));

                    updatedList[sourceProjectIndex] = {
                        ...updatedList[sourceProjectIndex],
                        tasks: remainingTasks
                    };
                }

                // Update both projects in backend
                handleCrossProjectMove(sourceProjectId, targetProjectId, updatedList);
            } else {
                // Same project reordering
                console.log('Same project reordering - calling updateTaskOrder');
                updateTaskOrder(targetProjectId, newState);
            }

            return updatedList;
        });
    };

    // Handle cross-project moves
    const handleCrossProjectMove = async (sourceProjectId: number, targetProjectId: number, updatedProjects: any[]) => {
        try {
            const sourceProject = updatedProjects.find((p: any) => p.id === sourceProjectId);
            const targetProject = updatedProjects.find((p: any) => p.id === targetProjectId);

            const updatePromises = [];

            // Update source project
            if (sourceProject) {
                updatePromises.push(
                    axios.put(`https://cybitbackend.onrender.com/api/projects/${sourceProjectId}`, {
                        title: sourceProject.title,
                        tasks: sourceProject.tasks
                    })
                );
            }

            // Update target project
            if (targetProject) {
                updatePromises.push(
                    axios.put(`https://cybitbackend.onrender.com/api/projects/${targetProjectId}`, {
                        title: targetProject.title,
                        tasks: targetProject.tasks
                    })
                );
            }

            await Promise.all(updatePromises);
            showMessage('Task moved between projects successfully!');
        } catch (error) {
            console.error('Error handling cross-project move:', error);
            showMessage('Error moving task between projects', 'error');
            fetchProjects(); // Refresh from database
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold">Scrumboard</h2>
                <button
                    type="button"
                    className="btn btn-primary flex"
                    onClick={() => addEditProject()}
                    disabled={loading}
                >
                    <IconPlus className="w-5 h-5 ltr:mr-3 rtl:ml-3" />
                    Add Project
                </button>
            </div>

            {loading && (
                <div className="flex justify-center mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}
            
            {/* project list */}
            <div className="relative pt-5">
                <div className="perfect-scrollbar h-full -mx-2">
                    <div className="overflow-x-auto flex items-start flex-nowrap gap-5 pb-2 px-2">
                        {projectList.map((project: any) => {
                            return (
                                <div key={project.id} className="panel w-80 flex-none" data-group={project.id}>
                                    <div className="flex justify-between mb-5">
                                        <h4 className="text-base font-semibold">{project.title}</h4>
                                        <div className="flex items-center">
                                            <button 
                                                onClick={() => addEditTask(project.id)} 
                                                type="button" 
                                                className="hover:text-primary ltr:mr-2 rtl:ml-2"
                                                disabled={loading}
                                            >
                                                <IconPlusCircle />
                                            </button>
                                            <div className="dropdown">
                                                <Dropdown
                                                    offset={[0, 5]}
                                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                    button={<IconHorizontalDots className="opacity-70 hover:opacity-100" />}
                                                >
                                                    <ul>
                                                        <li>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => addEditProject(project)}
                                                                disabled={loading}
                                                            >
                                                                Edit
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => deleteProject(project)}
                                                                disabled={loading}
                                                            >
                                                                Delete
                                                            </button>
                                        </li>
                                                        <li>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => clearProjects(project)}
                                                                disabled={loading}
                                                            >
                                                                Clear All
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <ReactSortable
                                        list={project.tasks || []}
                                        setList={handleSetList(project.id)}
                                        animation={200}
                                        group={{ name: 'shared', pull: true, put: true }}
                                        ghostClass="sortable-ghost"
                                        dragClass="sortable-drag"
                                        className="connect-sorting-content min-h-[150px] bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2"
                                        disabled={loading}
                                        sort={true}
                                    >
                                        {(project.tasks || []).length === 0 ? (
                                            <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                                <div className="text-2xl mb-2">📋</div>
                                                <p className="text-sm">Drop tasks here or click "Add Task"</p>
                                                <p className="text-xs mt-1 opacity-70">Position will be saved automatically</p>
                                            </div>
                                        ) : (
                                            (project.tasks || [])
                                                .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
                                                .map((task: any, index: number) => {
                                                    return (
                                                        <div className="sortable-list" key={`${project.id}-${task.id}-${index}`}>
                                                            <div className="shadow bg-white dark:bg-gray-700 p-4 rounded-lg mb-3 space-y-3 cursor-move hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-600 relative">
                                                                {/* Position indicator */}
                                                                <div className="absolute top-2 right-2 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                                                    #{task.position !== undefined ? task.position + 1 : index + 1}
                                                                </div>

                                                                {task.image && (
                                                                    <img 
                                                                        src="/assets/images/carousel1.jpeg" 
                                                                        alt="Task" 
                                                                        className="h-32 w-full object-cover rounded-md" 
                                                                    />
                                                                )}
                                                                
                                                                <div className="text-base font-medium pr-8">{task.title}</div>
                                                                <p className="break-all text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
                                                                
                                                                <div className="flex gap-2 items-center flex-wrap">
                                                                    {task.tags?.length ? (
                                                                        task.tags.map((tag: any, i: any) => {
                                                                            return (
                                                                                <div key={`${task.id}-tag-${i}`} className="btn px-2 py-1 flex btn-outline-primary text-xs">
                                                                                    <IconTag className="shrink-0 w-3 h-3" />
                                                                                    <span className="ltr:ml-1 rtl:mr-1">{tag}</span>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <div className="btn px-2 py-1 flex text-white-dark dark:border-white-dark/50 shadow-none text-xs">
                                                                            <IconTag className="shrink-0 w-3 h-3" />
                                                                            <span className="ltr:ml-1 rtl:mr-1">No Tags</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                
                                                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-600">
                                                                    <div className="font-medium flex items-center hover:text-primary text-sm">
                                                                        <IconCalendar className="ltr:mr-2 rtl:ml-2 shrink-0 w-4 h-4" />
                                                                        <span>{task.date}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <button 
                                                                            onClick={() => addEditTask(project.id, task)} 
                                                                            type="button" 
                                                                            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                                                                            disabled={loading}
                                                                            title="Edit Task"
                                                                        >
                                                                            <IconEdit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => deleteConfirmModal(project.id, task)} 
                                                                            type="button" 
                                                                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                                                                            disabled={loading}
                                                                            title="Delete Task"
                                                                        >
                                                                            <IconTrashLines className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                        )}
                                    </ReactSortable>
                                    
                                    <div className="pt-3">
                                        <button 
                                            type="button" 
                                            className="btn btn-primary w-full" 
                                            onClick={() => addEditTask(project.id)}
                                            disabled={loading}
                                        >
                                            <IconPlus className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                                            Add Task
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* add project modal */}
            <Transition appear show={isAddProjectModal} as={Fragment}>
                <Dialog as="div" open={isAddProjectModal} onClose={() => !loading && setIsAddProjectModal(false)} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] px-4 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddProjectModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                        disabled={loading}
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {params.id ? 'Edit Project' : 'Add Project'}
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={saveProject}>
                                            <div className="grid gap-5">
                                                <div>
                                                    <label htmlFor="title">Project Name</label>
                                                    <input 
                                                        id="title" 
                                                        value={params.title} 
                                                        onChange={changeValue} 
                                                        type="text" 
                                                        className="form-input mt-1" 
                                                        placeholder="Enter Project Name" 
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end items-center mt-8 gap-3">
                                                <button 
                                                    type="button" 
                                                    className="btn btn-outline-danger" 
                                                    onClick={() => setIsAddProjectModal(false)}
                                                    disabled={loading}
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 ltr:mr-2 rtl:ml-2"></span>
                                                    ) : null}
                                                    {params.id ? 'Update' : 'Add'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* add task modal */}
            <Transition appear show={isAddTaskModal} as={Fragment}>
                <Dialog as="div" open={isAddTaskModal} onClose={() => !loading && setIsAddTaskModal(false)} className="relative z-50">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                <button 
                                    onClick={() => setIsAddTaskModal(false)} 
                                    type="button" 
                                    className="absolute top-4 ltr:right-4 rtl:left-4 text-white-dark hover:text-dark"
                                    disabled={loading}
                                >
                                    <IconX />
                                </button>
                                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                    {paramsTask.id ? 'Edit Task' : 'Add Task'}
                                </div>
                                <div className="p-5">
                                    <form onSubmit={saveTask}>
                                        <div className="grid gap-5">
                                            <div>
                                                <label htmlFor="taskTitle">Task Name</label>
                                                <input 
                                                    id="title" 
                                                    value={paramsTask.title} 
                                                    onChange={addTaskData} 
                                                    type="text" 
                                                    className="form-input" 
                                                    placeholder="Enter Task Name" 
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="taskTag">Tags (comma separated)</label>
                                                <input 
                                                    id="tags" 
                                                    value={paramsTask.tags} 
                                                    onChange={addTaskData} 
                                                    type="text" 
                                                    className="form-input" 
                                                    placeholder="Enter Tags (e.g., design, development)" 
                                                    disabled={loading}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="taskdesc">Description</label>
                                                <textarea
                                                    id="description"
                                                    value={paramsTask.description}
                                                    onChange={addTaskData}
                                                    className="form-textarea min-h-[130px]"
                                                    placeholder="Enter Task Description"
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-center mt-8 gap-3">
                                            <button 
                                                onClick={() => setIsAddTaskModal(false)} 
                                                type="button" 
                                                className="btn btn-outline-danger"
                                                disabled={loading}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 ltr:mr-2 rtl:ml-2"></span>
                                                ) : null}
                                                {paramsTask.id ? 'Update' : 'Add'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* delete task modal */}
            <Transition appear show={isDeleteModal} as={Fragment}>
                <Dialog as="div" open={isDeleteModal} onClose={() => !loading && setIsDeleteModal(false)} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4 ">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden md:w-full max-w-lg w-[90%] my-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsDeleteModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-white-dark"
                                        disabled={loading}
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        Delete Task
                                    </div>
                                    <div className="p-5 text-center">
                                        <div className="text-white bg-danger ring-4 ring-danger/30 p-4 rounded-full w-fit mx-auto">
                                            <IconTrashLines />
                                        </div>
                                        <div className="text-base sm:w-3/4 mx-auto mt-5">
                                            Are you sure you want to delete this task?
                                        </div>
                                        <div className="flex justify-center items-center mt-8 gap-3">
                                            <button
                                                onClick={() => setIsDeleteModal(false)}
                                                type="button"
                                                className="btn btn-outline-danger"
                                                disabled={loading}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={deleteTask} 
                                                type="button" 
                                                className="btn btn-primary"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 ltr:mr-2 rtl:ml-2"></span>
                                                ) : null}
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Scrumboard;
