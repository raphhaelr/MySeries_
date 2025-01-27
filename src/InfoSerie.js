import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { Redirect } from 'react-router-dom'
import { Badge } from 'reactstrap'

const InfoSerie = ({ match }) => {
    const [form, setForm] = useState({
        name: ''
    })
    const [success, setSuccess] = useState(false)
    const [data, setData] = useState({})
    const [mode, setMode] = useState('INFO')
    const [genres, setGenres] = useState([])
    const [genreId, setGenreId] = useState('')

    useEffect(() => {
        Axios
            .get('/api/series/' + match.params.id)
            .then(res => {
                setData(res.data)
                setForm(res.data)
            })
    }, [match.params.id])

    useEffect(() => {
        Axios
            .get('/api/genres')
            .then(res => {
                setGenres(res.data.data)
                const encontrado = genres.find(value => data.genre === value.name)
                if (encontrado) {
                    setGenreId(encontrado.id)
                }
            })
    }, [data])

    //custom header
    const masterHeader = {
        height: '50vh',
        minHeight: '500px',
        backgroundImage: `url('${data.background}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }


    const onChange = field => evt => {
        setForm({
            ...form,
            [field]: evt.target.value
        })
    }

    const onChangeGenre = evt => {
        setGenreId(evt.target.value)
    }

    const seleciona = value => () => {
        setForm({
            ...form,
            status: value
        })
    }

    const onSave = () => {
        Axios
            .put('/api/series/' + match.params.id, {
                ...form,
                genre_id: genreId
            })
            .then(res => {
                setSuccess(true)
            })
    }

    if (success) {
        return <Redirect to='/series' />
    }

    return (

        <div>
            <header style={masterHeader}>
                <div className='h-100 ' style={{ background: 'rgba(0,0,0,0.7)' }}>
                    <div className='h-100 container'>

                        <div className='row h-100 align-items-center'>
                            <div className='col-3'>
                                <img alt={data.name} src={data.poster} className='img-fluid img-thumbnail' />
                            </div>
                            <div className='col-8'>
                                <h1 className='font-weight-light text-white'>{data.name}</h1>
                                <div className='lead-text-white'>
                                    {data.status === 'ASSISTIDO' && <Badge color='success'>Assistido</Badge>}
                                    {data.status === 'PARA_ASSISTIR' && <Badge color='warning'>Para assistir</Badge>}
                                    Genero:{data.genre}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className='container'>
                <button className='btn btn-primary' onClick={() => setMode('EDIT')}>Editar</button>
            </div>
            {
                mode === 'EDIT' && //swrap cut
                <div className='container'>
                    <h1>Editar Série</h1>
                    
                    <button className='btn btn-primary' onClick={() => setMode('INFO')}>Cancelar edição</button>
                    <form>
                        <div className='form-group'>
                            <label htmlFor='name'>Nome da série:</label>
                            <input type='text' value={form.name} onChange={onChange('name')} className='form-control' id='name' placeholder='Nome da série' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='name'>Comentários:</label>
                            <input type='text' value={form.comments} onChange={onChange('comments')} className='form-control' id='name' placeholder='Comentários sobre a série' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='name'>Genêro:</label>
                            <select className='form-control' onChange={onChangeGenre} value={genreId}>
                                {genres.map(genre => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
                            </select>
                        </div>
                        <div className='form-check'>
                            <input className='form-check-input' type='radio' name='status' id='assistido' checked={form.status === 'ASSISTIDO'} value='ASSISTIDO' onChange={seleciona('ASSISTIDO')} />
                            <label className='form-check-label' htmlFor='assistido'>
                                Assistido
                            </label>
                        </div>
                        <div className='form-check'>
                            <input className='form-check-input' type='radio' name='status' id='paraAssistir' checked={form.status === 'PARA_ASSISTIR'} value='PARA_ASSISTIR' onChange={seleciona('PARA_ASSISTIR')} />
                            <label className='form-check-label' htmlFor='paraAssistir'>
                                Para assistir
                            </label>
                        </div>
                        <button className='btn btn-primary' type='button' onClick={onSave}>Salvar</button>
                    </form>
                </div>
            }
        </div>
    )
}

export default InfoSerie