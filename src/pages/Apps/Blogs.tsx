import { useState, useEffect, Fragment } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Swal from 'sweetalert2';
import { Dialog, Transition } from '@headlessui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Dropdown from '../../components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconClipboardText from '../../components/Icon/IconClipboardText';
import IconListCheck from '../../components/Icon/IconListCheck';
import IconPlus from '../../components/Icon/IconPlus';
import IconMenu  from '../../components/Icon/IconMenu';
import IconSearch  from '../../components/Icon/IconSearch';
import IconX from '../../components/Icon/IconX';
import IconHorizontalDots  from '../../components/Icon/IconHorizontalDots';
// ...
import toast, { Toaster } from 'react-hot-toast'; // ✅ Import toast

import axios from 'axios';

const API_URL = 'https://cybitbackend.onrender.com/api';

export const fetchBlogs = () => axios.get(`${API_URL}/blogs`);
export const addBlog = (data: any) => axios.post(`${API_URL}/blogs`, data);
export const updateBlog = (id: string, data: any) => axios.put(`${API_URL}/blogs/${id}`, data);
export const deleteBlog = (id: string) => axios.delete(`${API_URL}/blogs/${id}`);

const Blogs = () => {
  const dispatch = useDispatch();
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass === 'rtl');

  const defaultParams = {
    id: '',
    title: '',
    description: '',
    descriptionText: '',
    image: null,
    priority: 'low',
    tag: '',
  };

  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [pagedTasks, setPagedTasks] = useState<any[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [params, setParams] = useState<any>(defaultParams);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [addTaskModal, setAddTaskModal] = useState(false);
  const [viewTaskModal, setViewTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(defaultParams);
  const [searchTask, setSearchTask] = useState('');
  const [selectedTab, setSelectedTab] = useState('');
  const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);

  const [pager] = useState({
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    startIndex: 0,
    endIndex: 0,
  });

  useEffect(() => {
    dispatch(setPageTitle('Blogs'));
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTasks = async () => {
    try {
      const res = await fetchBlogs();
      if (res.data.success) {
        setAllTasks(res.data.data);
        setFilteredTasks(res.data.data);
        getPager(res.data.data);
      } else {
        setAllTasks([]);
        setFilteredTasks([]);
      }
    } catch (err) {
      console.error(err);
      setAllTasks([]);
      setFilteredTasks([]);
    }
  };

  const changeValue = (e: any) => {
    const { value, id } = e.target;
    setParams({ ...params, [id]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setParams({ ...params, image: e.target.files[0] });
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const searchTasks = (isResetPage = true) => {
    if (isResetPage) pager.currentPage = 1;

    let res = allTasks.filter(task => task.status !== 'trash');

    if (['complete', 'important', 'trash'].includes(selectedTab)) {
      res = allTasks.filter(task => task.status === selectedTab);
    } else if (['team', 'update'].includes(selectedTab)) {
      res = res.filter(task => task.tag === selectedTab);
    } else if (['high', 'medium', 'low'].includes(selectedTab)) {
      res = res.filter(task => task.priority === selectedTab);
    }

    const filtered = res.filter(task => task.title?.toLowerCase().includes(searchTask.toLowerCase()));
    setFilteredTasks(filtered);
    getPager(filtered);
  };

  const getPager = (tasks: any[]) => {
    if (!tasks.length) {
      setPagedTasks([]);
      pager.startIndex = -1;
      pager.endIndex = -1;
      return;
    }
    pager.totalPages = Math.ceil(tasks.length / pager.pageSize);
    if (pager.currentPage > pager.totalPages) pager.currentPage = 1;

    pager.startIndex = (pager.currentPage - 1) * pager.pageSize;
    pager.endIndex = Math.min(pager.startIndex + pager.pageSize - 1, tasks.length - 1);

    setPagedTasks(tasks.slice(pager.startIndex, pager.endIndex + 1));
  };

  const setPriority = (task: any, priority: string) => {
    const updatedTasks = filteredTasks.map(t => (t._id === task._id ? { ...t, priority } : t));
    setFilteredTasks(updatedTasks);
    searchTasks(false);
  };

  const setTag = (task: any, tag: string) => {
    const updatedTasks = filteredTasks.map(t => (t._id === task._id ? { ...t, tag } : t));
    setFilteredTasks(updatedTasks);
    searchTasks(false);
  };

  const taskComplete = (task: any) => {
    const updatedTasks = filteredTasks.map(t =>
      t._id === task._id ? { ...t, status: t.status === 'complete' ? '' : 'complete' } : t
    );
    setFilteredTasks(updatedTasks);
    searchTasks(false);
  };

  const setImportant = (task: any) => {
    const updatedTasks = filteredTasks.map(t =>
      t._id === task._id ? { ...t, status: t.status === 'important' ? '' : 'important' } : t
    );
    setFilteredTasks(updatedTasks);
    searchTasks(false);
  };

  const addEditTask = (task: any = null) => {
    setIsShowTaskMenu(false);
    if (task) {
      setParams({ ...task });
      setImagePreview(task.path ? `/images/${task.path}` : null);
    } else {
      setParams(defaultParams);
      setImagePreview(null);
    }
    setAddTaskModal(true);
  };

  const viewTask = (task: any) => {
    setSelectedTask(task);
    setViewTaskModal(true);
  };

  // const deleteTaskHandler = async (task: any) => {
  //   try {
  //     await deleteBlog(task._id);
  //     loadTasks();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const showToast = (icon: 'success' | 'error' | 'warning', title: string) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    icon,
    title,
  });
};

const [saving, setSaving] = useState(false);

 const saveTask = async () => {
 if (!params.title || !params.title.trim()) {
    return showToast('warning', 'Title is required!');
  }
  if (!params.descriptionText || !params.descriptionText.trim()) {
    return showToast('warning', 'Description is required!');
  }

  try {
    setSaving(true); // ✅ Disable button while saving

    const formData = new FormData();
    formData.append('title', params.title);
    formData.append('description', params.description);
    if (params.image) formData.append('image', params.image);

    if (params._id) {
      await updateBlog(params._id, formData);
      showToast('success', 'Blog updated successfully!');
    } else {
      await addBlog(formData);
      showToast('success', 'Blog added successfully!');
    }

    setAddTaskModal(false);
    loadTasks();
  } catch (err) {
    console.error(err);
    showToast('error', 'Something went wrong. Try again!');
  } finally {
    setSaving(false); // ✅ Re-enable button
  }
};

const deleteTaskHandler = async (task: any) => {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This blog will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      await deleteBlog(task._id);
      loadTasks();
      showToast('success', 'Blog deleted successfully!');
    }
  } catch (err) {
    console.error(err);
    showToast('error', 'Failed to delete blog!');
  }
};


  return (
    <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Sidebar */}
      <div
        className={`panel p-4 flex-none w-[240px] max-w-full absolute xl:relative z-10 space-y-4 xl:h-auto h-full xl:block ltr:xl:rounded-r-md ltr:rounded-r-none rtl:xl:rounded-l-md rtl:rounded-l-none hidden ${
          isShowTaskMenu && '!block'
        }`}
      >
        <div className="flex flex-col h-full pb-16">
          <div className="pb-5 flex text-center items-center">
            <IconClipboardText />
            <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Blog List</h3>
          </div>
          <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b] mb-5"></div>
          <PerfectScrollbar className="relative ltr:pr-3.5 rtl:pl-3.5 ltr:-mr-3.5 rtl:-ml-3.5 h-full grow">
            <div className="space-y-1">
              <button
                type="button"
                className={`w-full flex justify-between items-center p-2 rounded-md font-medium h-10 ${
                  selectedTab === '' ? 'bg-gray-100 dark:text-primary text-primary dark:bg-[#181F32]' : ''
                }`}
                onClick={() => {
                  setSelectedTab('');
                  searchTasks();
                }}
              >
                <div className="flex items-center">
                  <IconListCheck className="w-4.5 h-4.5 shrink-0" />
                  <div className="ltr:ml-3 rtl:mr-3">Inbox</div>
                </div>
                <div className="bg-primary-light dark:bg-[#060818] rounded-md py-0.5 px-2 font-semibold whitespace-nowrap">
                  {allTasks.filter(d => d.status !== 'trash').length}
                </div>
              </button>
            </div>
          </PerfectScrollbar>
          <div className="ltr:left-0 rtl:right-0 absolute bottom-0 p-4 w-full">
            <button className="btn btn-primary w-full" onClick={() => addEditTask()}>
              <IconPlus className="ltr:mr-2 rtl:ml-2 shrink-0" />
              Add New Blog
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`overlay bg-black/60 z-[5] w-full h-full rounded-md absolute hidden ${
          isShowTaskMenu && '!block xl:!hidden'
        }`}
        onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}
      ></div>

      {/* Main Content */}
      <div className="panel p-0 flex-1 overflow-auto h-full">
        <div className="flex flex-col h-full">
          {/* Search & Pagination */}
          <div className="p-4 flex sm:flex-row flex-col w-full sm:items-center gap-4">
            <div className="ltr:mr-3 rtl:ml-3 flex items-center flex-1">
              <button type="button" className="xl:hidden hover:text-primary" onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}>
                <IconMenu />
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  className="form-input peer ltr:!pr-10 rtl:!pl-10"
                  placeholder="Search Task..."
                  value={searchTask}
                  onChange={e => setSearchTask(e.target.value)}
                  onKeyUp={() => searchTasks()}
                />
                <div className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                  <IconSearch />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive grow overflow-y-auto sm:min-h-[300px] min-h-[400px]">
            {pagedTasks.length ? (
              <table className="table-hover w-full">
                <tbody>
                  {pagedTasks.map(task => (
                    <tr key={task._id} className="group cursor-pointer">
                      <td className="w-1">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          onClick={() => taskComplete(task)}
                          defaultChecked={task.status === 'complete'}
                        />
                      </td>
                      <td onClick={() => viewTask(task)}>
                        <div className={`font-semibold ${task.status === 'complete' ? 'line-through' : ''}`}>
                          {task.title}
                        </div>
                        <div
                        className={`text-gray-600 line-clamp-2 ${task.status === 'complete' ? 'line-through' : ''}`}
                        dangerouslySetInnerHTML={{ __html: task.description }}
                        ></div>
                      </td>
                      
                      <td>
                        <div className="dropdown">
                          <Dropdown button={<IconHorizontalDots />}>
                            <ul>
                              <li>
                                <button onClick={() => addEditTask(task)}>Edit</button>
                              </li>
                              <li>
                                <button onClick={() => deleteTaskHandler(task)}>Delete</button>
                              </li>
                             
                            </ul>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex justify-center items-center font-semibold text-lg min-h-[300px]">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Transition appear show={addTaskModal} as={Fragment}>
        <Dialog as="div" className="relative z-[51]" onClose={() => setAddTaskModal(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-[black]/60" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center px-4 py-8">
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
                  <button type="button" onClick={() => setAddTaskModal(false)} className="absolute top-4 ltr:right-4 rtl:left-4">
                    <IconX />
                  </button>
                  <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                    {params.id ? 'Edit Blog' : 'Add Blog'}
                  </div>
                  <div className="p-5">
                    <div className="mb-5">
                      <label>Title</label>
                      <input id="title" type="text" className="form-input" value={params.title} onChange={changeValue} />
                    </div>
                    <div className="mb-5">
                      <label>Image</label>
                      <input type="file" accept="image/*" onChange={handleImageUpload} />
                      {imagePreview && <img src={imagePreview} className="h-32 w-32 object-cover rounded-md mt-2" alt="Preview" />}
                    </div>
                    <div className="mb-5">
                      <label>Description</label>
                      <ReactQuill
                        theme="snow"
                        value={params.description}
                        onChange={(content, delta, source, editor) =>
                          setParams({ ...params, description: content, descriptionText: editor.getText() })
                        }
                        style={{ minHeight: '200px' }}
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button className="btn btn-outline-danger" onClick={() => setAddTaskModal(false)}>
                        Cancel
                      </button>
                      <button
  className={`btn btn-primary ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
  onClick={saveTask}
  disabled={saving}
>
  {saving ? 'Saving...' : params.id ? 'Update' : 'Add'}
</button>


                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* View Modal */}
      <Transition appear show={viewTaskModal} as={Fragment}>
        <Dialog as="div" className="relative z-[51]" onClose={() => setViewTaskModal(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-[black]/60" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center px-4 py-8">
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
                  <button type="button" onClick={() => setViewTaskModal(false)} className="absolute top-4 ltr:right-4 rtl:left-4">
                    <IconX />
                  </button>
                  <div className="flex items-center flex-wrap gap-2 text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3">
                    <div>{selectedTask.title}</div>
                    {selectedTask.priority && <div className="badge">{selectedTask.priority}</div>}
                    {selectedTask.tag && <div className="badge">{selectedTask.tag}</div>}
                  </div>
                  <div className="p-5">
                    <div dangerouslySetInnerHTML={{ __html: selectedTask.description }}></div>
                    <div className="flex justify-end mt-4">
                      <button className="btn btn-outline-danger" onClick={() => setViewTaskModal(false)}>
                        Close
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

export default Blogs;
