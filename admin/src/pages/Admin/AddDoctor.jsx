import { useContext, useState } from 'react'
import { assets } from '@/assets/assets'
import { Check, SquareCheckBig } from 'lucide-react'
import { AdminContext } from '@/context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [experience, setExperience] = useState('')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [loading, setLoading] = useState(false)

  const { backendUrl, aToken } = useContext(AdminContext)

  const onSubmitHandler = async event => {
    event.preventDefault()
    setLoading(true)
    try {
      if (!docImg) return toast.error('Image Not Selected')

      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('phone', phone)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { aToken }
      })

      if (data.success) {
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setPhone('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')
        setExperience('')
        setSpeciality('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
      toast.error(errorMessage)
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return (
      name &&
      email &&
      password &&
      phone &&
      experience &&
      fees &&
      about &&
      speciality &&
      degree &&
      address1 &&
      address2
    )
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className='m-2 w-full max-w-[800px] flex flex-col items-center sm:items-start justify-center gap-4 p-4 bg-gray-50 rounded'
    >
      <p className='text-2xl sm:text-3xl font-semibold tracking-wide text-primary'>
        Doctor Details
      </p>

      <div className='flex flex-col items-center sm:items-start justify-center gap-4 w-full'>
        <div>
          <label htmlFor='doc-img'>
            <div className='min-w-44 p-2.5 rounded border border-gray-300 bg-gray-100 text-gray-500 flex flex-col items-center justify-center gap-2 cursor-crosshair'>
              <img
                className='size-32 sm:size-24 rounded-full border border-gray-300 object-contain'
                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                alt=''
              />
              <p className='flex items-center justify-center gap-2'>
                {docImg ? 'Uploaded' : 'Upload Photograph'}
                {docImg ? <Check size={18} className='text-primary' /> : ''}
              </p>
            </div>
          </label>
          <input
            onChange={e => setDocImg(e.target.files[0])}
            type='file'
            id='doc-img'
            hidden
          />
        </div>

        <div className='flex flex-col md:flex-row justify-start items-start gap-4 sm:gap-20 text-gray-600'>
          <div className='flex flex-col items-start justify-center gap-4'>
            <div className='flex flex-col items-stretch gap-1'>
              <p>Name</p>
              <input
                onChange={e => setName(e.target.value)}
                value={name}
                className='px-2.5 py-2 w-[80vw] sm:w-80 bg-gray-100 border border-gray-300 rounded'
                type='text'
                placeholder='Fullname'
              />
            </div>

            <div className='flex flex-col items-stretch gap-1'>
              <p>Email</p>
              <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                className='px-2.5 py-2 w-[80vw] sm:w-80 bg-gray-100 border border-gray-300 rounded'
                type='email'
                placeholder='Email Id'
              />
            </div>

            <div className='flex flex-col items-stretch gap-1'>
              <p>Password</p>
              <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                className='px-2.5 py-2 w-[80vw] sm:w-80 bg-gray-100 border border-gray-300 rounded'
                type='password'
                placeholder='Password'
              />
            </div>

            <div className='flex flex-col items-stretch gap-1'>
              <p>Phone Number</p>
              <input
                onChange={e => setPhone(e.target.value)}
                value={phone}
                className='px-2.5 py-2 w-[80vw] sm:w-80 bg-gray-100 border border-gray-300 rounded'
                type='text'
                placeholder='e.g., +91 98765 43210'
              />
            </div>

            <div className='flex flex-col w-full items-stretch gap-1'>
              <p>Experience</p>
              <select
                onChange={e => setExperience(e.target.value)}
                value={experience}
                className='px-2.5 py-2 w-[80vw] sm:w-80 bg-gray-100 border border-gray-300 rounded'
              >
                <option value='' disabled>Select</option>
                {[...Array(10).keys()].map(i => (
                  <option key={i + 1} value={`${i + 1} Year${i ? 's' : ''}`}>
                    {i + 1} Year{i ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex flex-col items-stretch gap-1'>
              <p>Appointment Fees</p>
              <input
                onChange={e => setFees(e.target.value)}
                value={fees}
                className='px-2.5 py-2 w-[80vw] sm:w-80 bg-gray-100 border border-gray-300 rounded'
                type='number'
                placeholder='₹₹'
              />
            </div>
          </div>

          <div className='flex flex-col items-start justify-center gap-4'>
            <div className='flex flex-col w-full items-stretch gap-1'>
              <p>Speciality</p>
              <select
                onChange={e => setSpeciality(e.target.value)}
                value={speciality}
                className='px-2.5 py-2 w-[80vw] sm:w-80 bg-gray-100 border border-gray-300 rounded'
              >
                <option value='' disabled>Select</option>
                {[
                  'General physician',
                  'Gynecologist',
                  'Dermatologist',
                  'Pediatricians',
                  'Neurologist',
                  'Gastroenterologist'
                ].map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className='flex flex-col w-full items-stretch gap-1'>
              <p>Education</p>
              <input
                onChange={e => setDegree(e.target.value)}
                value={degree}
                className='px-2.5 py-2 w-[80vw] sm:w-80 bg-gray-100 border border-gray-300 rounded'
                type='text'
                placeholder='Degree'
              />
            </div>

            <div className='flex flex-col w-full items-stretch gap-1'>
              <p>Address</p>
              <input
                onChange={e => setAddress1(e.target.value)}
                value={address1}
                className='px-2.5 py-2 w-[80vw] sm:w-80 bg-gray-100 border border-gray-300 rounded'
                type='text'
                placeholder='Line 1'
              />
              <input
                onChange={e => setAddress2(e.target.value)}
                value={address2}
                className='px-2.5 py-2 w-[80vw] sm:w-80 bg-gray-100 border border-gray-300 rounded'
                type='text'
                placeholder='Line 2'
              />
            </div>

            <div className='flex flex-col items-stretch gap-1 w-full'>
              <p>About</p>
              <textarea
                onChange={e => setAbout(e.target.value)}
                value={about}
                className='px-2.5 py-2 w-[80vw] sm:w-80 bg-gray-100 border border-gray-300 rounded h-28 resize-none'
                placeholder='Write a description to highlight the physician’s approach'
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-center sm:justify-end w-[93.6%] mt-4'>
        <button
          type='submit'
          disabled={!isFormValid() || loading}
          className={`py-3 px-5 rounded w-[50vw] sm:w-fit flex items-center justify-center gap-2 transition-all duration-200 ease-in ${
            !isFormValid() || loading
              ? 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-white border border-primary hover:opacity-90 active:scale-[97%]'
          }`}
        >
          <span>{loading ? 'Adding...' : 'Add Doctor'}</span>
          {loading ? (
            <div className='w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
          ) : (
            <SquareCheckBig size={18} />
          )}
        </button>
      </div>
    </form>
  )
}

export default AddDoctor
