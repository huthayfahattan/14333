# إعداد Firebase للتطبيق

## خطوات إعداد Firebase:

### 1. إنشاء مشروع Firebase
1. اذهب إلى: https://console.firebase.google.com/
2. اضغط "Create a project"
3. اسم المشروع: `lolivo-restaurant`
4. فعّل Google Analytics (اختياري)

### 2. إضافة تطبيق ويب
1. في لوحة التحكم، اضغط على أيقونة الويب `</>`
2. اسم التطبيق: `lolivo-web`
3. فعّل "Set up Firebase Hosting" (اختياري)

### 3. إعداد Firestore Database
1. في القائمة الجانبية، اضغط على "Firestore Database"
2. اضغط "Create database"
3. اختر "Start in test mode" (للاختبار)
4. اختر موقع قاعدة البيانات (الأقرب لمنطقتك)

### 4. الحصول على إعدادات Firebase
1. في لوحة التحكم، اضغط على "Project settings" (⚙️)
2. انتقل إلى تبويب "General"
3. في قسم "Your apps"، اضغط على التطبيق الذي أنشأته
4. انسخ إعدادات Firebase

### 5. تحديث الكود
استبدل الإعدادات في ملف `index.html`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 6. إعداد قواعد الأمان (اختياري)
في Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // للاختبار - يسمح بجميع العمليات
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 7. اختبار التطبيق
1. افتح التطبيق في المتصفح
2. افتح Developer Tools (F12)
3. في Console، يجب أن ترى: "Firebase initialized successfully"
4. جرب إضافة طلب جديد

## الميزات المضافة:

### ✅ حفظ الطلبات في قاعدة البيانات
- جميع الطلبات تُحفظ في Firestore
- رقم طلب فريد لكل طلب
- حفظ تفاصيل التخصيص

### ✅ تحديث حالة الطلبات
- المطعم يمكنه تحديث حالة الطلبات
- التحديثات تظهر فوراً لجميع المستخدمين

### ✅ الاستماع للتغييرات
- واجهة المطعم تتحدث تلقائياً عند وصول طلبات جديدة
- إشعارات صوتية للطلبات الجديدة

## استكشاف الأخطاء:

### إذا لم يعمل Firebase:
1. تأكد من صحة إعدادات Firebase
2. تحقق من قواعد الأمان في Firestore
3. تأكد من تفعيل Firestore Database
4. تحقق من Console للأخطاء

### رسائل الخطأ الشائعة:
- `Firebase: Error (auth/configuration-not-found)`: إعدادات Firebase خاطئة
- `Missing or insufficient permissions`: قواعد الأمان تمنع الوصول
- `Firebase App named '[DEFAULT]' already exists`: Firebase مُحمّل مسبقاً

## الدعم:
إذا واجهت مشاكل، تحقق من:
- Firebase Console للأخطاء
- Browser Console للأخطاء
- Network tab لطلبات Firebase
