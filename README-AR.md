# مشروع منيو كافيه — React + Firebase + Vercel

هذا مشروع جاهز كبداية عملية: منيو عام يفتح عبر QR، ولوحة إدارة منفصلة لإضافة المنتجات وتعديلها وحذفها وإدارة التصنيفات. التنقل يتم عبر React Router دون إعادة تحميل الصفحة.

## 1) تشغيل المشروع على جهازك

1. ثبّت Node.js (نسخة LTS) إن لم يكن مثبتاً.
2. فك ضغط المجلد وافتحه في VS Code.
3. افتح Terminal داخل مجلد المشروع نفسه.
4. نفّذ:
   ```bash
   npm install
   ```
5. أنشئ ملفاً باسم `.env.local` بجانب `package.json`، وانسخ إليه محتويات `.env.example` ثم استبدل القيم ببيانات Firebase الحقيقية.
6. شغّل:
   ```bash
   npm run dev
   ```
7. افتح العنوان الذي يظهر في Terminal (غالباً http://localhost:5173).

> البيانات التجريبية تظهر في المنيو العام إذا لم توجد بيانات في Firestore. لوحة الإدارة تحتاج إعداد Firebase فعلياً.

## 2) إنشاء مشروع Firebase

1. افتح https://console.firebase.google.com وسجّل الدخول بحساب Google.
2. اختر **Add project** وأنشئ مشروعاً باسم مثل `noir-cafe-menu`.
3. بعد إنشاء المشروع، اضغط أيقونة الويب `</>` لإضافة Web App.
4. سمّ التطبيق، ثم سجّل التطبيق. ستظهر لك إعدادات `firebaseConfig`.
5. انسخ القيم إلى `.env.local` وفق المطابقة التالية:
   - `apiKey` ← `VITE_FIREBASE_API_KEY`
   - `authDomain` ← `VITE_FIREBASE_AUTH_DOMAIN`
   - `projectId` ← `VITE_FIREBASE_PROJECT_ID`
   - `storageBucket` ← `VITE_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` ← `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` ← `VITE_FIREBASE_APP_ID`

ملاحظة: إعدادات Firebase الخاصة بتطبيق الويب ليست كلمة مرور إدارية. الحماية الحقيقية تكون بقواعد Firestore وFirebase Authentication. لا تضع Service Account أو مفاتيح Admin SDK داخل الواجهة.

## 3) تفعيل تسجيل دخول الأدمن

1. من Firebase Console افتح **Build → Authentication**.
2. اضغط **Get started** ثم **Sign-in method**.
3. فعّل **Email/Password** واحفظ.
4. من تبويب **Users** اضغط **Add user**.
5. أدخل بريد الأدمن وكلمة مرور قوية. هذه بيانات دخول لوحة الإدارة `/admin/login`.

## 4) إنشاء قاعدة Firestore

1. افتح **Build → Firestore Database**.
2. اضغط **Create database**.
3. اختر موقع قاعدة البيانات الأقرب لمستخدميك، ثم أنشئها.
4. افتح تبويب **Rules** واستبدل القواعد الموجودة بمحتوى الملف `firestore.rules` الموجود في المشروع، ثم اضغط **Publish**.
5. خذ UID لحساب الأدمن من **Authentication → Users**. افتح `firestore.rules` واستبدل النص `PUT_ADMIN_UID_HERE` بالـ UID الحقيقي، ثم انشر القواعد مجدداً.

القواعد تسمح للجمهور بقراءة المنتجات والتصنيفات فقط، وتسمح بالكتابة للمستخدم الذي يطابق UID الأدمن. لا تترك UID الافتراضي كما هو.

## 5) إنشاء التصنيفات والمنتجات

بعد تشغيل الموقع:
- المنيو العام: `/`
- صفحة دخول الإدارة: `/admin/login`
- لوحة الإدارة: `/admin`

سجّل الدخول، افتح تبويب **التصنيفات** وأضف مثلاً: القهوة الساخنة، المشروبات الباردة، الحلويات. بعد ذلك افتح **المنتجات** وأضف الأصناف والأسعار والوصف ورابط صورة اختياري.

### الصور
حقل الصورة يقبل رابط صورة مباشر يبدأ بـ `https://`. في هذه النسخة لم نفعّل رفع الصور إلى Firebase Storage حتى يبقى الإعداد بسيطاً ولا تحتاج إلى إعداد خدمة إضافية. يمكنك استخدام روابط صور تملك حق استخدامها.

## 6) النشر على Vercel

1. ارفع المشروع إلى GitHub، ولا ترفع ملف `.env.local`.
2. افتح https://vercel.com وسجّل الدخول عبر GitHub.
3. اختر **Add New → Project** ثم مستودع المشروع.
4. إعدادات Vite الافتراضية مناسبة:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. قبل الضغط على Deploy افتح **Environment Variables** وأضف متغيرات Firebase الستة نفسها الموجودة في `.env.local` (كل اسم وقيمته).
6. اضغط Deploy. عند تعديل متغيرات البيئة لاحقاً أعد النشر Redeploy.

ملف `vercel.json` موجود لمعالجة مسارات React Router عند فتح `/admin` مباشرة.

## 7) إنشاء QR Code

بعد النشر، افتح `/admin` واضغط **QR Code**. الرمز الذي يظهر يشير إلى رابط الموقع العام، ويمكن مسحه بكاميرا الهاتف. اطبع الرمز وضعه على الطاولات. لا تستخدم رابط localhost في QR؛ يجب أن يكون رابط Vercel المنشور.

## 8) شكل البيانات في Firestore

- Collection `categories`: كل مستند يحتوي `name`, `icon`, `order`.
- Collection `products`: كل مستند يحتوي `name`, `description`, `price`, `categoryId`, `image`, `available`, `featured`, `createdAt`, `updatedAt`.

## 9) ملاحظات قبل الاستخدام الحقيقي

- غيّر اسم `NOIR Café` وعبارة الوصف في `src/pages/MenuPage.jsx` و`src/components/Header.jsx`.
- غيّر العملة/تنسيق السعر في `ProductCard.jsx` و`ProductModal.jsx` و`AdminPage.jsx` بما يناسب الكافيه.
- لا يوجد طلب أو دفع إلكتروني؛ الموقع للعرض فقط كما طلبت.
- Firebase Web config يمكن أن يظهر في المتصفح؛ لا تضع أسراراً إدارية فيه. أمان الكتابة يعتمد على Authentication وقواعد Firestore.
- عند أول تشغيل، إذا ظهرت أخطاء صلاحيات، راجع UID في قواعد Firestore وتأكد من نشر القواعد.
