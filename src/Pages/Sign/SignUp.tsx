import React, {useContext, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import BodyContainer from "../../SharedUi/BodyContainer";
import Input from "../../SharedUi/Input";
import {Formik, FormikValues} from "formik";
import {FilledButton} from "../../SharedUi/Buttons";
import {MainTitle, Title} from "../../SharedUi/Titles";
import BlackCard from "../../Images/Cards/BlackCard.svg"
import {Subtitle} from "../../SharedUi/Titles";
import * as yup from 'yup';
import { InputColumnContainer } from "../../SharedUi/InputColumnContainer";
import CardSelection from "../../SharedUi/CardSelection";
import firebaseApp from "../../Firebase/FirebaseConfig";
import 'firebase/compat/auth';
import {AuthContext} from "../../Firebase/AuthContext";
import {Navigate} from "react-router-dom";

interface ISignUpForm {
    name: string,
    surname: string,
    email: string,
    password: string,
    cardStyle: string,
    //date: number,
}
const ValidationSchema = yup.object().shape({
    name: yup.string().typeError('Имя может содержать только буквы').required('Обязательно'),
    surname: yup.string().typeError('Фамилия может содержать только буквы').required('Обязательно'),
    email: yup.string().email('Неправильный формат почты').required('Обязательно'),
    password: yup.string().min(6, 'Длина не менее 6 символов').required('Обязательно'),
});



const SignUp = () =>
{
    const [selectedCard, setSelectedCard] = useState<string>(BlackCard);
    const {currentUser} = useContext(AuthContext);
    useEffect(() => {
        window.scrollTo(0,0);
    }, []);
    const onSubmit = async (values: {name: string, surname: string, email: string, password: string}) => {
        try {
            await firebaseApp
                .auth()
                .createUserWithEmailAndPassword(values.email, values.password);
                console.log(currentUser.uid);
        } catch (error) {
            alert(error);
        }
    }
    return(
        <BodyContainer>
        <MainTitle>Добро пожаловать в семью Бебра Банка!</MainTitle>
            <Subtitle>Введите ваше имя, фамилию, почту и придумайте пароль</Subtitle>
            <Formik initialValues={{
                name: '',
                surname: '',
                email: '',
                password: '',
            }} onSubmit={values => {onSubmit(values)}} validationSchema={ValidationSchema}>
                {({handleSubmit, handleChange, values, errors,handleBlur, touched}) =>
                    <>
                    <form onSubmit={handleSubmit}>
                        <InputColumnContainer>
                            <Input title={'Имя'} type={'text'} valueName={'name'} value={values.name} onChange={handleChange} onBlur={handleBlur} error={touched.name && errors.name? errors.name : ''}/>
                            <Input title={'Фамилия'} type={'text'} valueName={'surname'} value={values.surname} onChange={handleChange} onBlur={handleBlur} error={touched.surname && errors.surname? errors.surname : ''}/>
                            <Input title={'Почта'} type={'email'} valueName={'email'} value={values.email} onChange={handleChange} onBlur={handleBlur} error={touched.email && errors.email? errors.email : ''}/>
                            <Input title={'Пароль'} type={'password'} valueName={'password'} value={values.password} onChange={handleChange} onBlur={handleBlur} error={touched.password && errors.password? errors.password : ''}/>
                        </InputColumnContainer>
                        <div style={{marginTop:'50px'}}/>
                        <Title>Выберите дизайн вашей карты</Title>
                        <div style={{marginTop:'24px'}}/>
                        <CardSelection selectedCard={selectedCard} setSelectedCard={setSelectedCard}/>
                        <ButtonWrapper>
                        <FilledButton type='submit'>Создать аккаунт</FilledButton>
                        </ButtonWrapper>
                    </form>
                    </>
                }
            </Formik>
</BodyContainer>
        )
}


const ButtonWrapper = styled.div`
  margin-top: 32px;
  margin-bottom: 32px;
  @media(max-width: 512px) {
  text-align: center;
  }
`


export default SignUp;