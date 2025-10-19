import Image from "next/image";
import image1 from "../../public/1jpg.jpg"
import image2 from "../../public/2.jpg"
import image3 from "../../public/3.jpg"
import image4 from "../../public/4.jpg"
import image5 from "../../public/5.jpg"
import image6 from "../../public/6.jpg"
import Countdown from "@/reused/ui/Countdown";
import QuestionnaireForm from "@/reused/components/QuestionnaireForm";

export default function Home() {
    return (
        <div className="container-center">
            <main className="mt-4 w-full">

                <section>
                    <h1 className="text-[35px] font-medium text-neutral-400">Приглашение</h1>
                    <div className="flex items-center w-full justify-between mt-[80px] max-md:flex-col">
                        <div className="flex flex-col gap-6 items-center text-2xl font-extralight">
                            <span className="font-cursive text-[50px]">Н</span>
                            <div className="w-[200px] bg-black h-[0.5px]"></div>
                            <div className="flex flex-col gap-5 uppercase text-[20px] leading-3 items-center">
                                <div>Надежда</div>
                                <div>&</div>
                                <div>Егор</div>
                            </div>
                            <div className="w-[200px] bg-black h-[0.5px]"></div>
                            <span className="font-cursive text-[50px]">Е</span>
                        </div>
                        <Image src={image1} alt={""} width={300} height={700} />
                    </div>
                    <div className="flex flex-col w-full font-bold justify-end items-end mt-[50px] tracking-[4px]">
                        <span className="leading-[20px]">24 апреля 2026</span>
                        <span className="uppercase">Ждем вас</span>
                    </div>
                </section>

                <Countdown />

                <section className="mt-[50px]">
                    <span className="flex w-fit text-[30px] items-center m-auto">Дорогой гость!</span>
                    <div className="flex flex-col m-auto mt-6 text-center justify-center max-w-[500px]">
                        <p>Мы рады сообщить Вам, что 24.04.2026 состоится самое главное торжество в нашей жизни - день нашей свадьбы!</p>
                        <p>Приглашаем Вас разделить с нами радость этого незабываемого дня.</p>
                    </div>
                    <div className="mt-10">
                        <Image className="m-auto" src={image6} alt={""} width={300} height={400} />
                        <span className="flex mt-6 font-cursive text-[70px] font-light w-fit m-auto text-center leading-[60px] max-md:text-[30px] max-md:leading-8">Там, где посеяна любовь, растет радость</span>
                    </div>
                </section>

                <section className="mt-[80px]">
                    <div className="flex flex-col w-full items-center">
                        <Image className="rounded-[150px]" src={image3} alt={""} width={300} height={400} />
                        <div className="font-cursive text-[40px]">Жених</div>
                    </div>
                    <div className="flex flex-col w-full items-center mt-10">
                        <Image className="rounded-[150px]" src={image4} alt={""} width={300} height={400} />
                        <div className="font-cursive text-[40px]">Невеста</div>
                    </div>

                    <div className="flex flex-col gap-4 items-center mt-8">
                        <h2 className="font-poiret font-bold uppercase text-2xl">Что же вас ждет?</h2>
                        <span className="text-center">Роспись у нас уже была 24.04.2025, но день свадьбы мы решили отметить не менее значимым событием - венчанием. Свадьбу планируем отмечать в два дня.</span>
                    </div>

                    <div className="flex flex-col gap-4 items-center mt-8">
                        <h2 className="font-poiret font-bold uppercase text-2xl">Где? Как?</h2>
                        <span className="text-center">Торжество будет проходить во Владимире. Всю более точную информацию сообщим позже.</span>
                    </div>

                    <div className="flex flex-col gap-4 items-center mt-8">
                        <h2 className="font-poiret font-bold uppercase text-2xl">Что же сейчас?</h2>
                        <span className="text-center">Мы понимаем, что спланировать поезду на несколько дней не простая задача, которую можно решить за неделю. Поэтому мы приглашаем вас сейчас, чтобы у вас было время подумать.</span>
                    </div>

                    <div className="flex flex-col gap-2 items-center mt-8">
                        <h2 className="font-poiret font-bold uppercase text-2xl text-center">До какого дать ответ?</h2>
                        <span className="text-center">Просим дать ответ до 10.01.2026</span>
                    </div>


                    <span className="flex font-cursive justify-center text-center mt-4 text-[40px]">Ждем вас!</span>
                    <div className="flex flex-col w-full items-center mt-4">
                        <Image className="rounded-[150px]" src={image2} alt={""} width={200} height={400} />
                    </div>
                </section>

                <section className="flex flex-col gap-4 mt-[80px]">
                    <span className="flex justify-center">Примерная политра ниже, но более точная информация будет в январе</span>
                    <Image className="m-auto" src={image5} alt={""} width={300} height={400} />
                    <span className="flex justify-center text-center">Мы рады вижеть вас на нашем торжестве. Пожалуйста, примите к ссведению, что мероприятие только для взрослых.</span>
                </section>


                <QuestionnaireForm />


            </main>
        </div>
    );
}