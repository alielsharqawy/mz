import Swal from 'sweetalert2'

export const showSuccess = (message: string) => {
  return Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6',
    timer: 3000,
    timerProgressBar: true
  })
}

export const showError = (message: string) => {
  return Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#d33'
  })
}

export const showConfirm = (title: string, message: string) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  })
}

export const showLoading = (message: string = 'Loading...') => {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })
}

export const closeLoading = () => {
  Swal.close()
} 